const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // In ra để kiểm tra xem Server có đọc được file .env không (Chỉ in email, giấu pass)
  console.log("----------------------------------------------------");
  console.log("📧 ĐANG THỬ GỬI EMAIL...");
  console.log("👉 USER:", process.env.EMAIL_USER);
  console.log("👉 PASS:", process.env.EMAIL_PASS ? "****** (Đã nhận)" : "TRỐNG (Kiểm tra lại file .env)");

  // 1. Tạo Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Cấu hình email
  const mailOptions = {
    from: `"Art Shop Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // 3. Gửi và Bắt lỗi chi tiết
  try {
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ GỬI THÀNH CÔNG! ID:", info.messageId);
  } catch (error) {
      console.log("❌ GỬI THẤT BẠI! LỖI CHI TIẾT:");
      console.error(error); // In toàn bộ lỗi ra để đọc
  }
  console.log("----------------------------------------------------");
};

module.exports = sendEmail;