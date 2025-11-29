import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')));

  // Form state
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!user) {
        navigate('/login');
    }
  }, [navigate, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert("Mật khẩu nhập lại không khớp");
    } else {
        alert("Chức năng cập nhật đang phát triển!");
        // Logic gọi API cập nhật user sẽ nằm ở đây
    }
  };

  return (
    <div className="container py-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-white text-center py-3">
                        <h4 className="fw-bold mb-0 text-uppercase" style={{color: '#e65100'}}>Hồ sơ cá nhân</h4>
                    </div>
                    <div className="card-body p-4">
                        <div className="text-center mb-4">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                                alt="Avatar" 
                                className="rounded-circle shadow-sm border"
                                style={{width: '100px', height: '100px'}}
                            />
                            <h5 className="mt-2 fw-bold">{user?.username}</h5>
                            <p className="text-muted small">{user?.email}</p>
                            {user?.isAdmin && <span className="badge bg-danger">Administrator</span>}
                        </div>

                        <form onSubmit={submitHandler}>
                            <div className="mb-3">
                                <label className="form-label fw-bold small">Tên hiển thị</label>
                                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold small">Email</label>
                                <input className="form-control" value={email} disabled readOnly />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold small">Đổi mật khẩu mới</label>
                                <input className="form-control" type="password" placeholder="Bỏ trống nếu không đổi" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold small">Nhập lại mật khẩu</label>
                                <input className="form-control" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                            <button className="btn btn-dark w-100" style={{backgroundColor: '#e65100', border: 'none'}}>
                                Cập Nhật Thông Tin
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;