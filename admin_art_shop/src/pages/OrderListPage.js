import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

  useEffect(() => {
    if (!adminInfo || !adminInfo.isAdmin) {
        navigate('/login');
    } else {
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
                const { data } = await axios.get('https://localhost:5000/api/orders', config);
                setOrders(data);
            } catch (error) {
                console.error("Lỗi lấy danh sách đơn hàng");
            }
        };
        fetchOrders();
    }
  }, [navigate, adminInfo]);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4">Quản Lý Đơn Hàng</h2>
        <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered shadow-sm bg-white">
                <thead className="table-dark">
                    <tr>
                        <th>Mã Đơn</th>
                        <th>Khách Hàng</th>
                        <th>Ngày Đặt</th>
                        <th>Tổng Tiền</th>
                        <th>Thanh Toán</th>
                        <th>Giao Hàng</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id.substring(0, 8)}</td>
                            <td>
                                {order.user ? order.user.username : 'Khách vãng lai'}
                                <br/>
                                <small className="text-muted">{order.user?.email}</small>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td className="fw-bold">{order.totalPrice.toLocaleString()} đ</td>
                            
                            <td className="text-center">
                                {order.isPaid ? (
                                    <span className="badge bg-success">Đã TT ({new Date(order.paidAt).toLocaleDateString('vi-VN')})</span>
                                ) : (
                                    <span className="badge bg-danger">Chưa TT</span>
                                )}
                            </td>

                            <td className="text-center">
                                {order.isDelivered ? (
                                    <span className="badge bg-success">Đã Giao</span>
                                ) : (
                                    <span className="badge bg-warning text-dark">Đang Xử Lý</span>
                                )}
                            </td>

                            <td>
                                <Link to={`/order/${order._id}`} className="btn btn-primary btn-sm">
                                    Chi Tiết / Duyệt
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default OrderListPage;