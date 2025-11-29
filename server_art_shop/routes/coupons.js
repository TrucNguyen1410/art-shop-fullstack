const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. ADMIN: Tạo mã giảm giá
router.post('/', protect, admin, async (req, res) => {
    try {
        const { code, type, value, countInStock, expiryDate } = req.body;
        
        // Kiểm tra trùng
        const exists = await Coupon.findOne({ code: code.toUpperCase() });
        if (exists) return res.status(400).json({ message: 'Mã này đã tồn tại' });

        const coupon = new Coupon({
            code: code.toUpperCase(),
            type,
            value,
            countInStock,
            expiryDate
        });
        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// 2. ADMIN: Lấy danh sách mã
router.get('/', protect, admin, async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// 3. ADMIN: Xóa mã
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa mã' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa' });
    }
});

// 4. CLIENT: Áp dụng mã (Kiểm tra tính hợp lệ)
router.post('/apply', protect, async (req, res) => {
    const { code, orderTotal } = req.body;
    try {
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        // Kiểm tra tồn tại
        if (!coupon) {
            return res.status(404).json({ message: 'Mã giảm giá không tồn tại' });
        }

        // Kiểm tra hạn sử dụng
        if (new Date() > new Date(coupon.expiryDate)) {
            return res.status(400).json({ message: 'Mã này đã hết hạn' });
        }

        // Kiểm tra số lượng
        if (coupon.countInStock <= 0) {
            return res.status(400).json({ message: 'Mã này đã hết lượt sử dụng' });
        }

        // Tính toán số tiền giảm
        let discountAmount = 0;
        if (coupon.type === 'percent') {
            discountAmount = (orderTotal * coupon.value) / 100;
        } else {
            discountAmount = coupon.value;
        }

        // Không cho giảm quá giá trị đơn hàng
        if (discountAmount > orderTotal) discountAmount = orderTotal;

        res.json({
            success: true,
            discountAmount: discountAmount,
            code: coupon.code
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi xử lý mã' });
    }
});

module.exports = router;