import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlassMagnifier } from "react-image-magnifiers";

const ProductPage = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`https://art-shop-fullstack.onrender.com/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product');
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        setShowLoginModal(true);
    } else {
        addToCart(product);
    }
  };

  if (!product) return <div className="text-center py-5">Đang tải chi tiết tác phẩm...</div>;

  return (
    <div className="container mt-5 mb-5 position-relative">
      <div className="row">
        
        {/* --- CỘT ẢNH SẢN PHẨM (ĐÃ FIX LỖI ZOOM) --- */}
        <div className="col-md-6 mb-4">
          {/* Bỏ display:flex để tránh xung đột tính toán kích thước của thư viện */}
          <div className="border rounded p-2 shadow-sm bg-white">
            <div style={{ width: '100%', display: 'block' }}>
                <GlassMagnifier
                  imageSrc={product.imageUrl}
                  imageAlt={product.name}
                  largeImageSrc={product.imageUrl}
                  magnifierSize="40%"
                  magnifierBorderSize={2}
                  magnifierBorderColor="rgba(255, 255, 255, 0.5)"
                  square={true}
                  // Ép ảnh luôn chiếm 100% chiều ngang khung chứa để kính lúp nhận diện đúng
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
            </div>
          </div>
          <p className="text-center text-muted mt-2 small">
            <i className="bi bi-zoom-in"></i> Di chuột vào ảnh để phóng to chi tiết
          </p>
        </div>

        {/* --- CỘT THÔNG TIN --- */}
        <div className="col-md-6">
          <h2 className="fw-bold text-uppercase" style={{color: '#333'}}>{product.name}</h2>
          
          <div className="mb-3">
             <span className="badge bg-warning text-dark me-2">{product.category}</span>
             <span className="text-muted">Tác giả: <strong>{product.author || 'Đang cập nhật'}</strong></span>
          </div>

          <h3 className="text-danger fw-bold my-4" style={{fontSize: '2rem'}}>
            {product.price.toLocaleString()} đ
          </h3>

          <div className="p-3 bg-light rounded mb-4">
            <h5 className="fw-bold border-bottom pb-2">Mô tả tác phẩm</h5>
            <p className="mt-3" style={{lineHeight: '1.8', color: '#555'}}>
                {product.description}
            </p>
            <ul className="list-unstyled text-muted small">
                <li><i className="bi bi-check-circle-fill text-success"></i> Tác phẩm độc bản</li>
                <li><i className="bi bi-check-circle-fill text-success"></i> Có giấy chứng nhận tác giả</li>
                <li><i className="bi bi-check-circle-fill text-success"></i> Miễn phí vận chuyển toàn quốc</li>
            </ul>
          </div>

          <button 
            onClick={handleAddToCart} 
            className="btn btn-dark btn-lg w-100 py-3 text-uppercase fw-bold shadow"
            style={{backgroundColor: '#e65100', border: 'none'}}
          >
              Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {/* --- POPUP YÊU CẦU ĐĂNG NHẬP --- */}
      {showLoginModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.6)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title fw-bold">Thông Báo</h5>
                <button type="button" className="btn-close" onClick={() => setShowLoginModal(false)}></button>
              </div>
              <div className="modal-body text-center py-4">
                <i className="bi bi-shield-lock text-warning" style={{fontSize: '3rem'}}></i>
                <h5 className="mt-3">Bạn cần đăng nhập để mua hàng</h5>
                <p className="text-muted">Vui lòng đăng nhập hoặc đăng ký để thêm sản phẩm vào giỏ và thanh toán.</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowLoginModal(false)}>
                    Hủy bỏ
                </button>
                <Link to="/login" className="btn btn-dark px-4" style={{backgroundColor: '#e65100', border: 'none'}}>
                    Đăng Nhập Ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductPage;