import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const logout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/orders' && location.pathname.includes('/order')) return "nav-link active fw-bold text-white";
    return location.pathname === path ? "nav-link active fw-bold text-white" : "nav-link text-light";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <Link className="navbar-brand fw-bold text-uppercase" to="/">ADMIN ART SHOP</Link>
      
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><Link className={isActive('/')} to="/">Sản Phẩm</Link></li>
          <li className="nav-item"><Link className={isActive('/categories')} to="/categories">Danh Mục</Link></li>
          <li className="nav-item"><Link className={isActive('/orders')} to="/orders">Đơn Hàng</Link></li>
          <li className="nav-item"><Link className={isActive('/reviews')} to="/reviews">Đánh Giá</Link></li>
          <li className="nav-item"><Link className={isActive('/coupons')} to="/coupons">Mã KM</Link></li>
          <li className="nav-item"><Link className={isActive('/analytics')} to="/analytics">Báo Cáo</Link></li>
        </ul>
        
        <button onClick={logout} className="btn btn-outline-danger btn-sm">Đăng Xuất</button>
      </div>
    </nav>
  );
};

export default Navbar;