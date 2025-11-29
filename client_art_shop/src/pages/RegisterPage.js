import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu nhập lại
    if (password !== confirmPassword) {
        alert("Mật khẩu nhập lại không khớp!");
        return;
    }

    try {
      // Gọi API đăng ký
      const { data } = await axios.post('https://art-shop-fullstack.onrender.com/api/auth/register', { 
          username, 
          email, 
          password 
      });
      
      // Đăng ký xong thì tự động đăng nhập luôn
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      alert("Đăng ký thành công! Chào mừng bạn.");
      navigate('/');
    } catch (error) {
      alert("Đăng ký thất bại. Email có thể đã tồn tại.");
    }
  };

  return (
    <div className="container py-5">
        <div className="row justify-content-center">
            <div className="col-md-5">
                <div className="card shadow-lg border-0 rounded-3">
                    <div className="card-body p-5">
                        <h2 className="text-center fw-bold mb-4" style={{color: '#e65100'}}>Đăng Ký Tài Khoản</h2>
                        <form onSubmit={submitHandler}>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Tên hiển thị</label>
                                <input 
                                    type="text" 
                                    className="form-control py-2" 
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control py-2" 
                                    placeholder="name@example.com"
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Mật khẩu</label>
                                <input 
                                    type="password" 
                                    className="form-control py-2" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Nhập lại mật khẩu</label>
                                <input 
                                    type="password" 
                                    className="form-control py-2" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-dark w-100 py-2 fw-bold" style={{backgroundColor: '#e65100', border: 'none'}}>
                                Đăng Ký
                            </button>
                        </form>
                        <div className="text-center mt-4">
                            <p className="small text-muted">
                                Đã có tài khoản? <Link to="/login" className="text-decoration-none fw-bold" style={{color: '#e65100'}}>Đăng nhập ngay</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default RegisterPage;