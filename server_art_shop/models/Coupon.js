const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true }, // Mã (VD: SALE50)
    type: { type: String, required: true, enum: ['percent', 'fixed'] }, // Loại: phần trăm hoặc tiền mặt
    value: { type: Number, required: true }, // Giá trị (VD: 10 nếu là %, 50000 nếu là tiền)
    countInStock: { type: Number, required: true, default: 0 }, // Số lượng mã còn lại
    expiryDate: { type: Date, required: true }, // Hạn sử dụng
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);