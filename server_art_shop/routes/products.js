const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order'); // Import Order để kiểm tra mua hàng
const { protect, admin } = require('../middleware/authMiddleware');

// 1. Lấy danh sách sản phẩm (Lọc nâng cao)
router.get('/', async (req, res) => {
    try {
        const { keyword, category, material, color, status, minPrice, maxPrice } = req.query;
        let query = {};

        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { author: { $regex: keyword, $options: 'i' } }
            ];
        }
        if (category) query.category = { $regex: category, $options: 'i' };
        if (material) query.material = material;
        if (color) query.color = color;
        if (status) query.status = status;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// 2. Lấy chi tiết sản phẩm
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) res.json(product);
        else res.status(404).json({ message: 'Không tìm thấy' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// 3. Admin Xóa sản phẩm
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa' });
    } catch (error) { res.status(500).json({ message: 'Lỗi xóa' }); }
});

// 4. Admin Tạo sản phẩm
router.post('/', protect, admin, async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) { res.status(400).json({ message: 'Lỗi dữ liệu' }); }
});

// 5. Admin Sửa sản phẩm
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            Object.assign(product, req.body);
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else { res.status(404).json({ message: 'Không tìm thấy' }); }
    } catch (error) { res.status(500).json({ message: 'Lỗi cập nhật' }); }
});

// 6. KHÁCH HÀNG ĐÁNH GIÁ (CÓ KIỂM TRA ĐÃ MUA HÀNG)
router.post('/:id/reviews', protect, async (req, res) => {
    const { rating, comment } = req.body;
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Kiểm tra đã đánh giá chưa
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );
            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
            }

            // Kiểm tra đã mua và nhận hàng chưa
            const hasPurchased = await Order.findOne({
                user: req.user._id,
                isDelivered: true, 
                'orderItems.product': req.params.id 
            });

            if (!hasPurchased) {
                return res.status(400).json({ message: 'Bạn cần mua và nhận hàng thành công mới được đánh giá.' });
            }

            const review = {
                name: req.user.username,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Đánh giá thành công!' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// 7. ADMIN TRẢ LỜI ĐÁNH GIÁ (Cập nhật vào sản phẩm)
router.put('/:id/reviews/:reviewId/reply', protect, admin, async (req, res) => {
    const { reply } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            const review = product.reviews.id(req.params.reviewId);
            if (review) {
                review.adminReply = reply;
                review.replyDate = Date.now();
                await product.save();
                res.json({ message: 'Đã trả lời đánh giá' });
            } else { res.status(404).json({ message: 'Không tìm thấy bình luận' }); }
        } else { res.status(404).json({ message: 'Không tìm thấy sản phẩm' }); }
    } catch (error) { res.status(500).json({ message: 'Lỗi server' }); }
});

// 8. API MỚI: LẤY TẤT CẢ ĐÁNH GIÁ (CHO TRANG QUẢN TRỊ ADMIN)
router.get('/admin/reviews', protect, admin, async (req, res) => {
    try {
        // Lấy tất cả sản phẩm
        const products = await Product.find({}).select('name imageUrl reviews');
        
        let allReviews = [];
        
        // Gom tất cả review lại thành 1 mảng phẳng
        products.forEach(product => {
            if (product.reviews) {
                product.reviews.forEach(review => {
                    allReviews.push({
                        _id: review._id,
                        productId: product._id,
                        productName: product.name,
                        productImage: product.imageUrl,
                        userName: review.name,
                        rating: review.rating,
                        comment: review.comment,
                        createdAt: review.createdAt,
                        adminReply: review.adminReply
                    });
                });
            }
        });

        // Sắp xếp review mới nhất lên đầu
        allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        res.json(allReviews);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;