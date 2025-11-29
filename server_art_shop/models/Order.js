const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            imageUrl: { type: String, required: true },
            price: { type: Number, required: true },
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true }, // 'PayPal', 'MoMo', 'COD'
    paymentResult: { // Lưu kết quả trả về từ PayPal
        id: { type: String },
        status: { type: String },
        email_address: { type: String },
    },
    shippingMethod: { type: String, required: true }, // 'Tiêu chuẩn' hoặc 'Đặc biệt'
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);