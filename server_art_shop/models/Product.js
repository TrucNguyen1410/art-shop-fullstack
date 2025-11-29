const mongoose = require('mongoose');

// Schema cho từng Review (Đánh giá)
const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true }, // Số sao (1-5)
    comment: { type: String, required: true }, // Lời bình
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    adminReply: { type: String }, // <-- Admin trả lời tại đây
    replyDate: { type: Date }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, default: 'Chưa cập nhật' },
    
    // Các trường bộ lọc
    material: { type: String, default: 'Khác' },
    size: { type: String, default: 'Tiêu chuẩn' },
    color: { type: String, default: 'Đa sắc' },
    status: { type: String, default: 'Còn hàng' },

    // --- CẤU HÌNH REVIEW ---
    reviews: [reviewSchema], // Mảng chứa các đánh giá
    rating: { type: Number, required: true, default: 0 }, // Điểm trung bình
    numReviews: { type: Number, required: true, default: 0 }, // Tổng số lượng đánh giá
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);