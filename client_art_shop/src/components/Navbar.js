import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaRegUser, FaClipboardList } from 'react-icons/fa';

const Navbar = ({ cartCount, user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState('');

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && keyword.trim()) {
      navigate(`/shop?keyword=${keyword}`);
      setShowSearch(false);
    }
  };

  // Hàm kiểm tra active link để gạch chân
  const isActive = (pathOrCategory) => {
    const params = new URLSearchParams(location.search);
    const currentCategory = params.get('category');
    const currentPath = location.pathname;

    if (pathOrCategory === '/') return currentPath === '/' ? 'active-category' : '';
    if (pathOrCategory === '/culture') return currentPath === '/culture' ? 'active-category' : '';
    if (pathOrCategory === '/orders') return currentPath === '/orders' ? 'active-category' : '';
    
    return currentCategory === pathOrCategory ? 'active-category' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
      <div className="container-fluid position-relative">
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
          <span className="navbar-toggler-icon"></span>
        </button>

        <Link className="navbar-brand-centered" to="/">ART CRAFT</Link>

        <div className="collapse navbar-collapse justify-content-between" id="navbarMain">
          
          {/* MENU BÊN TRÁI */}
          <ul className="navbar-nav">
            <li className="nav-item"><Link className={`nav-link nav-link-custom ${isActive('/')}`} to="/">Home</Link></li>
            <li className="nav-item"><Link className={`nav-link nav-link-custom ${isActive('Tranh')}`} to="/shop?category=Tranh">Tranh</Link></li>
            <li className="nav-item"><Link className={`nav-link nav-link-custom ${isActive('Tượng')}`} to="/shop?category=Tượng">Tượng</Link></li>
            <li className="nav-item"><Link className={`nav-link nav-link-custom ${isActive('Gốm')}`} to="/shop?category=Gốm">Gốm</Link></li>
            <li className="nav-item"><Link className={`nav-link nav-link-custom ${isActive('/culture')}`} to="/culture">Văn Hóa VN</Link></li>
          </ul>

          {/* MENU BÊN PHẢI */}
          <ul className="navbar-nav align-items-center">
            <li className="nav-item"><Link className="nav-link nav-link-custom" to="/about">Về chúng tôi</Link></li>
            
            {/* 1. Tìm kiếm */}
            <li className="nav-item d-flex align-items-center">
              {showSearch && (
                <input 
                  type="text" className="search-box me-2" placeholder="Tìm kiếm..." 
                  value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={handleSearchSubmit} autoFocus
                />
              )}
              <FaSearch className="icon-btn" onClick={() => setShowSearch(!showSearch)} title="Tìm kiếm" />
            </li>

            {/* 2. Icon Đơn hàng (Chỉ hiện khi đã đăng nhập) */}
            {user && (
                <li className="nav-item">
                    <Link to="/orders" className="text-decoration-none text-dark">
                        <FaClipboardList className="icon-btn" title="Đơn hàng của tôi" />
                    </Link>
                </li>
            )}

            {/* 3. Dropdown Tài khoản (Login/Register/Profile/Admin/Logout) */}
            <li className="nav-item">
                <div className="dropdown">
                   <span className="icon-btn" data-bs-toggle="dropdown" aria-expanded="false" style={{cursor: 'pointer'}}>
                      {user ? <FaUser title={`Chào, ${user.username}`} /> : <FaRegUser title="Tài khoản" />}
                   </span>
                   <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                     
                     {user ? (
                        <>
                            <li><span className="dropdown-item-text text-muted small">Xin chào, <strong>{user.username}</strong></span></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>Hồ sơ cá nhân</Link></li>
                            {user.isAdmin && <li><a className="dropdown-item text-danger" href="http://localhost:3001" target="_blank" rel="noreferrer"><i className="bi bi-gear me-2"></i>Trang Quản Trị</a></li>}
                            <li><hr className="dropdown-divider"/></li>
                            <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Đăng xuất</button></li>
                        </>
                     ) : (
                        <>
                            <li><Link className="dropdown-item" to="/login"><i className="bi bi-box-arrow-in-right me-2"></i>Đăng nhập</Link></li>
                            <li><Link className="dropdown-item" to="/register"><i className="bi bi-person-plus me-2"></i>Đăng ký</Link></li>
                        </>
                     )}

                   </ul>
                </div>
            </li>

            {/* 4. Giỏ hàng */}
            <li className="nav-item position-relative">
              <Link to="/cart" className="text-decoration-none text-dark">
                <FaShoppingCart className="icon-btn" title="Giỏ hàng" />
                {cartCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>{cartCount}</span>}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;