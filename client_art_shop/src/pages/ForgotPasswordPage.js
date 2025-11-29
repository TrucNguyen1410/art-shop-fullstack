import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('https://art-shop-fullstack.onrender.com/api/auth/forgot-password', { email });
      toast.success(data.data);
      // Chuyển sang trang nhập OTP
      navigate('/reset-password'); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-5 text-center">
              <h3 className="fw-bold mb-3" style={{color: '#e65100'}}>Quên Mật Khẩu?</h3>
              <p className="text-muted mb-4">Nhập email của bạn, chúng tôi sẽ gửi mã OTP xác thực.</p>
              
              <form onSubmit={submitHandler}>
                <div className="mb-3">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Nhập địa chỉ email..." 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <button className="btn btn-dark w-100" style={{backgroundColor: '#e65100', border: 'none'}} disabled={loading}>
                    {loading ? 'Đang gửi...' : 'Gửi Mã OTP'}
                </button>
              </form>

              <div className="mt-4">
                <Link to="/login" className="text-decoration-none text-muted">Quay lại Đăng nhập</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;