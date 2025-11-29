import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

// --- IMPORT CÁC TRANG ---
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import CulturePage from './pages/CulturePage';   
import CheckoutPage from './pages/CheckoutPage'; 
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage'; 

// --- QUAN TRỌNG: IMPORT 2 TRANG QUÊN MẬT KHẨU ---
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const exist = cart.find((x) => x._id === product._id);
    if (exist) {
      setCart(cart.map((x) => x._id === product._id ? { ...exist, qty: exist.qty + 1 } : x));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    toast.success(`Đã thêm "${product.name}" vào giỏ!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((x) => x._id !== id));
    toast.info("Đã xóa sản phẩm khỏi giỏ", { autoClose: 1000 });
  };

  return (
    <Router>
      <Navbar cartCount={cart.length} user={user} setUser={setUser} />
      <ToastContainer />

      <div className="container-fluid p-0">
        <Routes>
          {/* Trang Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage addToCart={addToCart} />} />
          <Route path="/culture" element={<CulturePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/product/:id" element={<ProductPage addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
          
          {/* Xác thực (Auth) */}
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage setUser={setUser} />} />
          
          {/* --- QUAN TRỌNG: ROUTES QUÊN MẬT KHẨU --- */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Trang User (Cần đăng nhập) */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;