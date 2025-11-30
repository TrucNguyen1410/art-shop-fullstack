const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); 

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. ĐĂNG KÝ (Giữ nguyên)
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email đã tồn tại' });

        const user = await User.create({ username, email, password });
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } catch (error) { res.status(500).json({ message: 'Lỗi server' }); }
});

// 2. ĐĂNG NHẬP (Giữ nguyên)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        } else { res.status(401).json({ message: 'Sai thông tin đăng nhập' }); }
    } catch (error) { res.status(500).json({ message: 'Lỗi server' }); }
});

// 3. QUÊN MẬT KHẨU (CHẾ ĐỘ DEMO KHẨN CẤP - LUÔN TRẢ VỀ OTP)
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
        }

        // Tạo OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Lưu OTP vào DB
        user.resetPasswordToken = otp;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Cố gắng gửi email (nhưng không bắt buộc thành công)
        const message = `Mã OTP của bạn là: ${otp}`;
        try {
            await sendEmail({
                email: user.email,
                subject: 'Mã OTP Art Shop',
                message
            });
        } catch (err) {
            console.log("Gửi mail thất bại do Google chặn (Bỏ qua để Demo):", err.message);
        }

        // --- QUAN TRỌNG: GỬI LUÔN OTP VỀ CLIENT ĐỂ DEMO ---
        res.json({ 
            success: true, 
            data: `Đã gửi yêu cầu! Mã OTP của bạn là: ${otp}` // <--- Lấy mã ở đây nhập luôn
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// 4. XÁC NHẬN OTP VÀ ĐỔI MẬT KHẨU
router.put('/reset-password', async (req, res) => {
    const { otp, password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: otp,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Mã OTP không đúng hoặc đã hết hạn' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ success: true, data: "Đổi mật khẩu thành công! Hãy đăng nhập lại." });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;