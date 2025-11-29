import React from 'react';
import { Link } from 'react-router-dom';

const CartPage = ({ cart, removeFromCart }) => {
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  // Kiểm tra đăng nhập
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Nếu chưa đăng nhập, hiển thị thông báo yêu cầu đăng nhập
  if (!userInfo) {
      return (
          <div className="container text-center py-5">
              <div className="card shadow-sm p-5 mx-auto" style={{maxWidth: '600px'}}>
                  <h2 className="mb-3 text-danger fw-bold">Quyền Truy Cập Bị Từ Chối</h2>
                  <p className="lead mb-4">Bạn cần đăng nhập để xem và quản lý giỏ hàng của mình.</p>
                  <div>
                      <Link to="/login" className="btn btn-lg btn-warning text-dark px-5 fw-bold shadow-sm">Đăng Nhập Ngay</Link>
                  </div>
                  <div className="mt-3">
                      <Link to="/" className="text-decoration-none text-muted">Quay lại trang chủ</Link>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 fw-bold text-uppercase border-bottom pb-2">Giỏ Hàng Của Bạn</h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-5 bg-light rounded shadow-sm">
            <h4 className="text-muted mb-3">Giỏ hàng của bạn đang trống</h4>
            <p className="text-muted">Hãy dạo một vòng và chọn những tác phẩm ưng ý nhé!</p>
            <Link to="/shop" className="btn btn-dark mt-2 px-4">Quay lại mua sắm</Link>
        </div>
      ) : (
        <div className="row">
          {/* Danh sách sản phẩm */}
          <div className="col-md-8 mb-4">
            <ul className="list-group shadow-sm">
              {cart.map((item) => (
                <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <div className="d-flex align-items-center">
                    <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        style={{width: '80px', height: '80px', objectFit: 'cover'}} 
                        className="me-3 rounded border"
                    />
                    <div>
                        <h6 className="my-0 fw-bold">{item.name}</h6>
                        <small className="text-muted">Đơn giá: {item.price.toLocaleString()} đ</small>
                        <br/>
                        <small className="text-muted">Số lượng: <strong>{item.qty}</strong></small>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-trash"></i> Xóa
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tổng tiền và Nút thanh toán */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 bg-white">
                <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-4">Tóm Tắt Đơn Hàng</h5>
                    
                    <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted">Tạm tính:</span>
                        <span className="fw-bold">{totalPrice.toLocaleString()} đ</span>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <span className="text-muted">Giảm giá:</span>
                        <span className="text-success">0 đ</span>
                    </div>
                    
                    <hr className="my-4"/>
                    
                    <div className="d-flex justify-content-between mb-4 align-items-center">
                        <span className="h5 fw-bold mb-0">Tổng cộng:</span>
                        <span className="h4 fw-bold text-danger mb-0">{totalPrice.toLocaleString()} đ</span>
                    </div>
                    
                    {/* NÚT CHUYỂN SANG TRANG CHECKOUT */}
                    <Link to="/checkout" className="btn btn-success w-100 py-3 fw-bold text-uppercase shadow-sm">
                        Tiến Hành Thanh Toán
                    </Link>
                    
                    <div className="text-center mt-3">
                        <Link to="/shop" className="text-decoration-none small text-muted">
                            <i className="bi bi-arrow-left"></i> Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;