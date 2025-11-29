import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsPage = () => {
  const [summary, setSummary] = useState({
      totalOrders: 0,
      totalRevenue: 0,
      totalProductsSold: 0,
      totalUsers: 0,
      dailyRevenue: []
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Lấy thông tin Admin từ LocalStorage
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

    // 2. Kiểm tra: Nếu không có adminInfo (chưa đăng nhập) -> Đá về Login ngay
    if (!adminInfo || !adminInfo.token) {
        navigate('/login');
        return;
    }

    // 3. Nếu có Token thì mới gọi API
    const fetchSummary = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
            // Gọi API Thống kê (Lưu ý HTTPS)
            const { data } = await axios.get('https://localhost:5000/api/orders/admin/summary', config);
            setSummary(data);
        } catch (error) {
            console.error("Lỗi tải thống kê:", error);
            // Nếu token hết hạn hoặc lỗi, có thể đá về login luôn
            if(error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };
    fetchSummary();

  }, [navigate]);

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4 fw-bold text-dark">Báo Cáo & Thống Kê</h2>
        
        {/* 1. CÁC THẺ SỐ LIỆU TỔNG QUAN */}
        <div className="row mb-5">
            {/* Doanh Thu */}
            <div className="col-md-3">
                <div className="card text-white bg-success mb-3 shadow h-100">
                    <div className="card-header fw-bold">Tổng Doanh Thu</div>
                    <div className="card-body">
                        <h3 className="card-title">{summary.totalRevenue ? summary.totalRevenue.toLocaleString() : 0} ₫</h3>
                        <p className="card-text small">Doanh thu thực tế</p>
                    </div>
                </div>
            </div>

            {/* Sản phẩm bán ra */}
            <div className="col-md-3">
                <div className="card text-white bg-warning mb-3 shadow h-100">
                    <div className="card-header fw-bold text-dark">Sản Phẩm Đã Bán</div>
                    <div className="card-body text-dark">
                        <h3 className="card-title">{summary.totalProductsSold}</h3>
                        <p className="card-text small">Số lượng tác phẩm</p>
                    </div>
                </div>
            </div>

            {/* Tổng đơn hàng */}
            <div className="col-md-3">
                <div className="card text-white bg-info mb-3 shadow h-100">
                    <div className="card-header fw-bold text-dark">Tổng Đơn Hàng</div>
                    <div className="card-body text-dark">
                        <h3 className="card-title">{summary.totalOrders}</h3>
                        <p className="card-text small">Đơn hàng thành công</p>
                    </div>
                </div>
            </div>

            {/* Khách hàng */}
            <div className="col-md-3">
                <div className="card text-white bg-primary mb-3 shadow h-100">
                    <div className="card-header fw-bold">Khách Hàng</div>
                    <div className="card-body">
                        <h3 className="card-title">{summary.totalUsers}</h3>
                        <p className="card-text small">Tài khoản đăng ký</p>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. BIỂU ĐỒ DOANH THU (CHART) */}
        <div className="row">
            <div className="col-12">
                <div className="card shadow-sm">
                    <div className="card-header bg-white fw-bold">
                        <i className="bi bi-graph-up me-2"></i>Biểu Đồ Doanh Thu
                    </div>
                    <div className="card-body" style={{height: '400px'}}>
                        {/* Chỉ vẽ biểu đồ khi có dữ liệu để tránh lỗi */}
                        {summary.dailyRevenue && summary.dailyRevenue.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={summary.dailyRevenue}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                                    <Legend />
                                    <Bar dataKey="income" name="Doanh Thu" fill="#e65100" barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center text-muted pt-5">Đang tải dữ liệu biểu đồ...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;