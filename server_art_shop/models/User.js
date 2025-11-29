const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    
    // 2 trường quản lý quên mật khẩu
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });

// --- ĐÃ SỬA LỖI TẠI ĐÂY ---
// Bỏ tham số 'next' trong ngoặc, và bỏ dòng gọi next()
// Mongoose mới tự động hiểu khi dùng async
userSchema.pre('save', async function () {
    // Nếu mật khẩu không bị thay đổi thì thoát luôn, không làm gì cả
    if (!this.isModified('password')) {
        return;
    }
    
    // Nếu có thay đổi (đăng ký mới hoặc đổi pass), thì mã hóa
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);