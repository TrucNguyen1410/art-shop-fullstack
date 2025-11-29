import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        toast.error("Mật khẩu nhập lại không khớp!");
        return;
    }

    try {
      // Gửi OTP và Mật khẩu mới lên Server
      const { data } = await axios.put('https://localhost:5000/api/auth/reset-password', { otp, password });
      toast.success(data.data);
      navigate('/login'); // Xong thì về trang đăng nhập
    } catch (error) {
      toast.error(error.response?.data?.message || "Mã OTP không đúng");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-5">
              <h3 className="fw-bold mb-4 text-center" style={{color: '#e65100'}}>Đặt Lại Mật Khẩu</h3>
              <p className="text-center text-muted small mb-4">Vui lòng kiểm tra Email và nhập mã OTP 6 số.</p>
              
              <form onSubmit={submitHandler}>
                <div className="mb-3">
                  <label className="fw-bold small">Mã OTP (6 số)</label>
                  <input 
                    type="text" 
                    className="form-control text-center fw-bold fs-5" 
                    placeholder="------" 
                    maxLength="6"
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="fw-bold small">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="fw-bold small">Nhập lại mật khẩu</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </div>
                <button className="btn btn-dark w-100" style={{backgroundColor: '#e65100', border: 'none'}}>
                    Xác Nhận Đổi Mật Khẩu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;