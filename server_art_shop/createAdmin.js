const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import model User
const bcrypt = require('bcryptjs');

// Load biến môi trường để lấy MONGO_URI
dotenv.config();

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ Đã kết nối MongoDB...');
        
        // 1. Kiểm tra xem admin đã tồn tại chưa
        const adminExists = await User.findOne({ email: 'admin@gmail.com' });
        if (adminExists) {
            console.log('⚠️ Tài khoản Admin đã tồn tại!');
            process.exit();
        }

        // 2. Tạo tài khoản Admin mới
        // Mật khẩu "123456" sẽ được tự động mã hóa nhờ file models/User.js
        const user = new User({
            username: 'Admin Shop',
            email: 'admin@gmail.com',
            password: '123456', 
            isAdmin: true  // Đây là dòng quan trọng nhất để cấp quyền Admin
        });

        await user.save();
        console.log('🎉 Đã tạo thành công tài khoản Admin: admin@gmail.com / 123456');
        process.exit();
    })
    .catch((err) => {
        console.error('❌ Lỗi:', err);
        process.exit(1);
    });