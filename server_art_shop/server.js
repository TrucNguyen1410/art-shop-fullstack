const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); 

// 1. Cấu hình biến môi trường
dotenv.config();

// 2. Khởi tạo ứng dụng Express
const app = express();

// 3. Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());

// 4. Kết nối Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// 5. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/coupons', require('./routes/coupons'));

app.get('/', (req, res) => {
    res.send('API Art Shop is running...');
});

// 6. Khởi chạy Server (Render Friendly)
const PORT = process.env.PORT || 5000;

// Trên Render, chúng ta chỉ cần chạy app.listen bình thường.
// Render sẽ tự động lo phần HTTPS cho bạn.
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});