const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); 
const https = require('https');   
const fs = require('fs');         

// 1. Cấu hình biến môi trường
dotenv.config();

// 2. Khởi tạo ứng dụng Express (PHẢI CÓ DÒNG NÀY TRƯỚC KHI DÙNG app.use)
const app = express();

// 3. Middleware Bảo mật & Cấu hình
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(express.json());

// 4. Kết nối Cơ sở dữ liệu MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// 5. Định tuyến (Routes) - Đặt tất cả ở đây
app.use('/api/auth', require('./routes/auth'));             // Đăng ký, Đăng nhập
app.use('/api/products', require('./routes/products'));     // Sản phẩm, Đánh giá
app.use('/api/categories', require('./routes/categories')); // Danh mục
app.use('/api/orders', require('./routes/orders'));         // Đơn hàng
app.use('/api/coupons', require('./routes/coupons'));       // <--- MÃ GIẢM GIÁ (MỚI)

// Route mặc định
app.get('/', (req, res) => {
    res.send('API Art Shop (Secure Mode) is running...');
});

// 6. Khởi chạy Server
const PORT = process.env.PORT || 5000;

try {
    const httpsOptions = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    };

    https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`🔒 Secure Server running on https://localhost:${PORT}`);
    });

} catch (error) {
    console.log("⚠️ Không tìm thấy chứng chỉ SSL. Đang chạy chế độ HTTP thường.");
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}