const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
// Đảm bảo bạn đã tạo file utils/sendEmail.js như hướng dẫn trước
const sendEmail = require('../utils/sendEmail'); 

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. ĐĂNG KÝ
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

// 2. ĐĂNG NHẬP
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

// 3. QUÊN MẬT KHẨU (GỬI MÃ OTP QUA EMAIL)
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
        }

        // Tạo mã OTP 6 số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Lưu OTP vào DB (field resetPasswordToken)
        user.resetPasswordToken = otp;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút

        await user.save();

        // Nội dung Email HTML
        const message = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px;">
                <h2 style="color: #e65100;">Yêu cầu đặt lại mật khẩu</h2>
                <p>Xin chào <strong>${user.username}</strong>,</p>
                <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản tại Art Shop.</p>
                <p>Mã xác thực (OTP) của bạn là:</p>
                <div style="background: #eee; padding: 10px; text-align: center; border-radius: 5px; margin: 20px 0;">
                    <h1 style="color: #333; letter-spacing: 5px; margin: 0;">${otp}</h1>
                </div>
                <p style="font-size: 0.9rem; color: #666;">Mã này sẽ hết hạn sau 10 phút. Tuyệt đối không chia sẻ mã này cho ai.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Mã OTP Đặt Lại Mật Khẩu - Art Shop',
                message
            });
            res.json({ success: true, data: "Đã gửi mã OTP đến email của bạn!" });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Không thể gửi email. Vui lòng kiểm tra lại cấu hình.' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// 4. XÁC NHẬN OTP VÀ ĐỔI MẬT KHẨU
router.put('/reset-password', async (req, res) => {
    const { otp, password } = req.body;

    try {
        // Tìm user có OTP trùng khớp và còn hạn
        const user = await User.findOne({
            resetPasswordToken: otp,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Mã OTP không đúng hoặc đã hết hạn' });
        }

        // Cập nhật mật khẩu mới
        user.password = password;
        
        // Xóa OTP
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ success: true, data: "Đổi mật khẩu thành công! Hãy đăng nhập lại." });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;