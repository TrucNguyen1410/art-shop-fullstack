import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductEditPage from './pages/ProductEditPage';
import CategoryListPage from './pages/CategoryListPage';
import OrderListPage from './pages/OrderListPage';
import OrderProcessPage from './pages/OrderProcessPage';
import ReviewListPage from './pages/ReviewListPage';
import CouponPage from './pages/CouponPage';
import AnalyticsPage from './pages/AnalyticsPage'; // <--- Đảm bảo có dòng này

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Trang chủ Admin */}
        <Route path="/" element={<DashboardPage />} />
        
        {/* Quản lý danh mục */}
        <Route path="/categories" element={<CategoryListPage />} />
        
        {/* Sản phẩm */}
        <Route path="/product/:id" element={<ProductEditPage />} />
        
        {/* Đơn hàng */}
        <Route path="/orders" element={<OrderListPage />} />
        <Route path="/order/:id" element={<OrderProcessPage />} />
        
        {/* Đánh giá */}
        <Route path="/reviews" element={<ReviewListPage />} />

        {/* Mã Giảm Giá */}
        <Route path="/coupons" element={<CouponPage />} />

        {/* Báo Cáo Thống Kê (MỚI) */}
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;