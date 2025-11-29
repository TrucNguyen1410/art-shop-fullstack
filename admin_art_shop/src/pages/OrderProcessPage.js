import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OrderProcessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

  useEffect(() => {
    if (!adminInfo) navigate('/login');
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        const { data } = await axios.get(`https://art-shop-fullstack.onrender.com/api/orders/${id}`, config);
        setOrder(data);
    } catch (error) {
        alert("Lỗi tải đơn hàng");
    }
  };

  // Xử lý nút: Xác nhận đã thanh toán
  const deliverHandler = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        await axios.put(`https://art-shop-fullstack.onrender.com/api/orders/${id}/deliver`, {}, config);
        alert("Đã cập nhật: Giao hàng thành công!");
        fetchOrder();
    } catch (error) { alert("Lỗi cập nhật giao hàng"); }
  };

  // Xử lý nút: Xác nhận đã giao hàng
  const payHandler = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        await axios.put(`https://art-shop-fullstack.onrender.com/api/orders/${id}/pay`, {}, config);
        alert("Đã cập nhật: Thanh toán thành công!");
        fetchOrder();
    } catch (error) { alert("Lỗi cập nhật thanh toán"); }
  };

  if (!order) return <div>Đang tải...</div>;

  return (
    <div>
      <Navbar />
      <div className="container mt-4 mb-5">
        <h3 className="mb-3">Chi Tiết / Duyệt Đơn Hàng #{order._id}</h3>
        
        <div className="row">
            <div className="col-md-8">
                <div className="card mb-3 shadow-sm">
                    <div className="card-header fw-bold">1. Thông tin người nhận</div>
                    <div className="card-body">
                        <p><strong>Tên:</strong> {order.user?.username}</p>
                        <p><strong>Email:</strong> {order.user?.email}</p>
                        <p><strong>Địa chỉ:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                        <p><strong>SĐT:</strong> {order.shippingAddress.phone}</p>
                    </div>
                </div>

                <div className="card mb-3 shadow-sm">
                    <div className="card-header fw-bold">2. Sản phẩm đã đặt</div>
                    <ul className="list-group list-group-flush">
                        {order.orderItems.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img src={item.imageUrl} alt={item.name} style={{width: '50px', height: '50px', objectFit: 'cover'}} className="me-3 rounded"/>
                                    <span>{item.name} (x{item.qty})</span>
                                </div>
                                <span>{item.price.toLocaleString()} đ</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="col-md-4">
                <div className="card shadow-sm">
                    <div className="card-header bg-dark text-white fw-bold">Xử Lý Đơn Hàng</div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label className="fw-bold">Phương thức thanh toán:</label>
                            <div className="alert alert-info py-2 mt-1">
                                {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận (COD)' : 
                                 order.paymentMethod === 'momo' ? 'Chuyển khoản / Ví điện tử' : 'PayPal / Thẻ'}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="fw-bold">Trạng thái Thanh Toán:</label>
                            {order.isPaid ? (
                                <div className="alert alert-success py-2 mt-1">Đã thanh toán</div>
                            ) : (
                                <div className="alert alert-danger py-2 mt-1">Chưa thanh toán</div>
                            )}
                            {/* Nút duyệt thanh toán thủ công (Cho COD/Chuyển khoản) */}
                            {!order.isPaid && (
                                <button onClick={payHandler} className="btn btn-warning w-100 mb-2">
                                    Xác nhận Đã Thanh Toán
                                </button>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="fw-bold">Trạng thái Giao Hàng:</label>
                            {order.isDelivered ? (
                                <div className="alert alert-success py-2 mt-1">Đã giao hàng</div>
                            ) : (
                                <div className="alert alert-warning py-2 mt-1">Chưa giao hàng</div>
                            )}
                            {/* Nút duyệt giao hàng */}
                            {!order.isDelivered && (
                                <button onClick={deliverHandler} className="btn btn-primary w-100">
                                    Xác nhận Đã Giao Hàng
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProcessPage;