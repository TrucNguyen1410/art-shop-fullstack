import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://localhost:5000/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      toast.success(`Chào mừng ${data.username} quay trở lại!`);
      
      // Nếu là Admin thì có thể chuyển hướng khác, ở đây về trang chủ
      navigate('/'); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="container py-5" style={{minHeight: '80vh', display: 'flex', alignItems: 'center'}}>
        <div className="row justify-content-center w-100">
            <div className="col-md-5">
                <div className="card shadow-lg border-0 rounded-4">
                    <div className="card-body p-5">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-uppercase" style={{color: '#e65100', letterSpacing: '1px'}}>Đăng Nhập</h2>
                            <p className="text-muted">Chào mừng bạn đến với Art Shop</p>
                        </div>
                        
                        <form onSubmit={submitHandler}>
                            <div className="mb-3">
                                <label className="form-label fw-bold small">Email</label>
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
                                <label className="form-label fw-bold small">Mật khẩu</label>
                                <input 
                                    type="password" 
                                    className="form-control py-2" 
                                    placeholder="••••••"
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required
                                />
                            </div>
                            
                            <div className="d-flex justify-content-end mb-4">
                                <Link to="/forgot-password" style={{fontSize: '0.9rem', color: '#e65100', textDecoration: 'none'}}>
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            <button type="submit" className="btn btn-dark w-100 py-2 fw-bold shadow-sm" style={{backgroundColor: '#e65100', border: 'none'}}>
                                ĐĂNG NHẬP
                            </button>
                        </form>
                        
                        <div className="text-center mt-4">
                            <p className="small text-muted">
                                Chưa có tài khoản? <Link to="/register" className="text-decoration-none fw-bold" style={{color: '#e65100'}}>Đăng ký ngay</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;