import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://localhost:5000/api/auth/login', { email, password });
      
      // Kiểm tra quyền Admin ngay lúc đăng nhập
      if (data.isAdmin) {
        localStorage.setItem('adminInfo', JSON.stringify(data)); // Lưu biến khác với client để không bị lẫn
        navigate('/');
      } else {
        alert("Tài khoản này không có quyền Admin!");
      }
    } catch (error) {
      alert("Sai thông tin đăng nhập!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card p-4 shadow">
            <h3 className="text-center mb-3">Admin Login</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3"><label>Email</label><input className="form-control" onChange={e => setEmail(e.target.value)} /></div>
              <div className="mb-3"><label>Password</label><input type="password" className="form-control" onChange={e => setPassword(e.target.value)} /></div>
              <button className="btn btn-dark w-100">Đăng nhập Quản Trị</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;