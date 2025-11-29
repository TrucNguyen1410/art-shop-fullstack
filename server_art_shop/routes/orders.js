const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. Tạo đơn hàng mới
router.post('/', protect, async (req, res) => {
    const {
        orderItems, shippingAddress, paymentMethod, shippingMethod,
        shippingPrice, totalPrice, isPaid, paidAt, paymentResult
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'Không có sản phẩm trong giỏ' });
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems, shippingAddress, paymentMethod, shippingMethod,
            shippingPrice, totalPrice,
            isPaid: isPaid || false,
            paidAt: isPaid ? Date.now() : null,
            paymentResult: paymentResult || {}
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});

// 2. Lấy danh sách đơn hàng của tôi (Kèm Review)
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        const ordersWithReviews = await Promise.all(orders.map(async (order) => {
            const orderObj = order.toObject(); 
            const itemsWithReview = await Promise.all(orderObj.orderItems.map(async (item) => {
                const product = await Product.findById(item.product);
                if (product) {
                    const userReview = product.reviews.find(r => r.user.toString() === req.user._id.toString());
                    if (userReview) {
                        return { ...item, myReview: userReview }; 
                    }
                }
                return item;
            }));
            return { ...orderObj, orderItems: itemsWithReview };
        }));
        res.json(ordersWithReviews);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy danh sách đơn hàng' });
    }
});

// 3. Admin: Lấy tất cả đơn hàng
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id username email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) { res.status(500).json({ message: 'Lỗi server' }); }
});

// --- 4. API THỐNG KÊ (DỮ LIỆU THẬT) ---
router.get('/admin/summary', protect, admin, async (req, res) => {
    try {
        // 1. Tổng đơn hàng
        const totalOrders = await Order.countDocuments();

        // 2. Tổng doanh thu (Chỉ tính đơn đã thanh toán)
        const totalRevenueData = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].total : 0;

        // 3. Tổng sản phẩm bán ra
        const totalProductsSoldData = await Order.aggregate([
            { $match: { isPaid: true } },
            { $unwind: '$orderItems' },
            { $group: { _id: null, totalQty: { $sum: '$orderItems.qty' } } }
        ]);
        const totalProductsSold = totalProductsSoldData.length > 0 ? totalProductsSoldData[0].totalQty : 0;

        // 4. Tổng khách hàng
        const totalUsers = await User.countDocuments({ isAdmin: false });

        // 5. TÍNH TOÁN BIỂU ĐỒ 7 NGÀY GẦN NHẤT (REALTIME)
        const dailyRevenue = [];
        
        // Vòng lặp 7 ngày (từ 6 ngày trước đến hôm nay)
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            
            // Xác định đầu ngày và cuối ngày
            const startOfDay = new Date(d.setHours(0, 0, 0, 0));
            const endOfDay = new Date(d.setHours(23, 59, 59, 999));

            // Tính tổng tiền các đơn ĐÃ THANH TOÁN trong khoảng thời gian này
            // Lưu ý: Dùng 'updatedAt' hoặc 'paidAt' để tính ngày doanh thu thực tế
            const revenueData = await Order.aggregate([
                { 
                    $match: { 
                        isPaid: true, 
                        updatedAt: { $gte: startOfDay, $lte: endOfDay } 
                    } 
                },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]);

            dailyRevenue.push({
                date: `${startOfDay.getDate()}/${startOfDay.getMonth() + 1}`, // Hiển thị ngày/tháng (VD: 29/11)
                income: revenueData.length > 0 ? revenueData[0].total : 0
            });
        }

        res.json({ totalOrders, totalRevenue, totalProductsSold, totalUsers, dailyRevenue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi thống kê' });
    }
});

// 5. Lấy chi tiết 1 đơn
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'username email');
        if (order) res.json(order);
        else res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    } catch (error) { res.status(500).json({ message: 'Lỗi server' }); }
});

// 6. Cập nhật thanh toán
router.put('/:id/pay', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = { status: 'Admin_Confirmed' }; 
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else { res.status(404).json({ message: 'Không tìm thấy đơn hàng' }); }
    } catch (error) { res.status(500).json({ message: 'Lỗi cập nhật' }); }
});

// 7. Cập nhật giao hàng
router.put('/:id/deliver', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else { res.status(404).json({ message: 'Không tìm thấy đơn hàng' }); }
    } catch (error) { res.status(500).json({ message: 'Lỗi cập nhật' }); }
});

module.exports = router;