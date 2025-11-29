const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Cấu hình Transporter (người vận chuyển)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Cấu hình nội dung email
  const mailOptions = {
    from: `"Art Shop Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, // Dùng HTML để mail đẹp hơn
  };

  // 3. Gửi mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;