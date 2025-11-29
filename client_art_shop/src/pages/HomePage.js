import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(true); // State bật tắt Popup

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('https://art-shop-fullstack.onrender.com/api/products');
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  // Hàm render danh sách sản phẩm (Dùng class product-grid để responsive)
  const renderProductList = (productList) => (
    <div className="product-grid">
      {productList.map((product) => (
        <Link to={`/product/${product._id}`} key={product._id} className="text-decoration-none">
          <div className="product-card-home">
            <div className="product-img-container">
              <img src={product.imageUrl} className="product-img-home" alt={product.name} />
            </div>
            <div className="product-info-home">
              <h5 title={product.name}>{product.name}</h5>
              <div className="d-flex align-items-center justify-content-between mt-2">
                <span className="price-current">{product.price.toLocaleString()}đ</span>
                <span className="badge bg-light text-dark border" style={{fontWeight: 'normal', fontSize: '0.75rem'}}>
                    {product.category}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="position-relative">
      
      {/* =================================================================
          POPUP SỰ KIỆN (LỄ HỘI NGHỆ THUẬT) - VIỀN VÀNG NGÀ
         ================================================================= */}
      {showPopup && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" 
             style={{backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999}}>
            
            <div className="bg-white position-relative text-center shadow-lg animate__animated animate__fadeInUp" 
                 style={{
                     maxWidth: '550px', 
                     width: '100%', 
                     border: '12px solid #f4e9d6', // <--- VIỀN MÀU VÀNG NGÀ
                     borderRadius: '8px',
                     padding: '0',
                     maxHeight: '90vh',
                     overflowY: 'auto'
                 }}>
                
                {/* Nút tắt Popup */}
                <button 
                    onClick={() => setShowPopup(false)}
                    className="position-absolute top-0 end-0 m-2 btn btn-sm btn-light border rounded-circle shadow-sm"
                    style={{width: '32px', height: '32px', padding: 0, zIndex: 10, fontSize: '16px', fontWeight: 'bold'}}
                >
                    ✕
                </button>

                {/* Nội dung Popup */}
                <div>
                    {/* Hình ảnh nghệ thuật trong Popup */}
                    <div style={{
                        height: '220px', 
                        backgroundImage: 'url("https://toquoc.mediacdn.vn/2019/3/1/truc-chi-1551428988441219350908.jpg")',
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center'
                    }}></div>
                    
                    <div className="p-4">
                        <h5 className="text-uppercase text-muted mb-2" style={{letterSpacing: '2px', fontSize: '0.8rem'}}>Chào mừng bạn đến với</h5>
                        <h2 className="fw-bold mb-3" style={{color: '#8b4513', fontFamily: 'Courier New, monospace', fontSize: '2rem'}}>LỄ HỘI NGHỆ THUẬT</h2>
                        
                        <p className="text-muted mb-4 small">
                            Khám phá những tác phẩm độc bản với ưu đãi đặc biệt dành riêng cho người yêu nghệ thuật.
                        </p>

                        {/* Nút CTA trong Popup */}
                        <Link to="/shop" onClick={() => setShowPopup(false)} className="btn btn-dark btn-lg px-5 rounded-0 w-100" style={{backgroundColor: '#8b4513', border: 'none'}}>
                            KHÁM PHÁ NGAY
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      )}


      {/* =================================================================
          GIAO DIỆN CHÍNH (BANNER TINH HOA & CÁC MỤC)
         ================================================================= */}
      
      {/* 1. HERO BANNER (STYLE GỐC: NỀN VÀNG NGÀ) */}
      <div 
        className="d-flex align-items-center justify-content-center mb-5" 
        style={{
            backgroundColor: '#f4e9d6', // Màu nền vàng ngà gốc
            minHeight: '60vh', // Chiều cao linh hoạt theo màn hình
            padding: '40px 20px'
        }}
      >
        <div className="bg-white p-4 p-md-5 text-center shadow-sm" style={{borderRadius: '8px', maxWidth: '700px', width: '100%'}}>
            <h1 className="display-5 fw-bold mb-3" style={{color: '#5a3e2b'}}>Tinh Hoa Nghệ Thuật Việt</h1>
            <p className="lead text-muted mb-4 fs-6">
                Khám phá và sở hữu những tác phẩm độc bản từ các nghệ nhân hàng đầu.
            </p>
            <Link to="/shop" className="btn btn-dark btn-lg px-5 rounded-pill w-100 w-md-auto" style={{backgroundColor: '#222'}}>
                Khám Phá Ngay
            </Link>
        </div>
      </div>

      <div className="container">

        {/* 2. CÁC BỘ SƯU TẬP NỔI BẬT */}
        <div className="mb-5">
            <h3 className="text-center fw-bold mb-4 text-uppercase" style={{color: '#333'}}>Bộ Sưu Tập Nổi Bật</h3>
            {/* Sử dụng Grid system của Bootstrap để responsive */}
            <div className="row g-3">
                {/* Tranh */}
                <div className="col-12 col-md-4">
                    <Link to="/shop?category=Tranh" className="text-decoration-none">
                        <div className="position-relative rounded overflow-hidden shadow-sm product-card-home">
                            <img 
                                src="https://cdn.arttimes.vn/upload/2-2024/images/2024-04-08/1712542930-2k.jpg" 
                                className="w-100" style={{height: '250px', objectFit: 'cover'}} alt="Tranh"
                            />
                            <div className="position-absolute top-50 start-50 translate-middle bg-white px-4 py-2 rounded shadow opacity-90 fw-bold text-uppercase text-dark text-nowrap">
                                Tranh Nghệ Thuật
                            </div>
                        </div>
                    </Link>
                </div>
                {/* Tượng */}
                <div className="col-12 col-md-4">
                    <Link to="/shop?category=Tượng" className="text-decoration-none">
                        <div className="position-relative rounded overflow-hidden shadow-sm product-card-home">
                            <img 
                                src="https://www.gomnghethuat.com/wp-content/uploads/Top-10-Lang-Gom-Noi-Tieng-o-Viet-Nam.jpg" 
                                className="w-100" style={{height: '250px', objectFit: 'cover'}} alt="Tượng"
                            />
                            <div className="position-absolute top-50 start-50 translate-middle bg-white px-4 py-2 rounded shadow opacity-90 fw-bold text-uppercase text-dark text-nowrap">
                                Tượng Điêu Khắc
                            </div>
                        </div>
                    </Link>
                </div>
                {/* Gốm */}
                <div className="col-12 col-md-4">
                    <Link to="/shop?category=Gốm" className="text-decoration-none">
                        <div className="position-relative rounded overflow-hidden shadow-sm product-card-home">
                            <img 
                                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                                className="w-100" style={{height: '250px', objectFit: 'cover'}} alt="Gốm"
                            />
                            <div className="position-absolute top-50 start-50 translate-middle bg-white px-4 py-2 rounded shadow opacity-90 fw-bold text-uppercase text-dark text-nowrap">
                                Gốm Bát Tràng
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>

        {/* 3. NGHỆ NHÂN TIÊU BIỂU (Tĩnh - Responsive) */}
        <div className="mb-5 py-5" style={{backgroundColor: '#fffcf5', margin: '0 -12px'}}>
            <div className="container">
                <h3 className="text-center fw-bold mb-5 text-uppercase">Nghệ Nhân Tiêu Biểu</h3>
                <div className="row text-center g-4">
                    {/* col-6 col-md-3: Mobile hiện 2 người/hàng, PC hiện 4 người/hàng */}
                    <div className="col-6 col-md-3">
                        <div className="text-dark">
                            <img src="https://vanart-gallery.com/wp-content/uploads/2025/09/hinh-anh-Hoa-Si-Do-Khai-1024x768.jpg" className="rounded-circle mb-3 shadow" style={{width: '100px', height: '100px', objectFit: 'cover'}} alt="Artist"/>
                            <h6 className="fw-bold" style={{fontSize: '0.9rem'}}>Nghệ nhân Đỗ Khải</h6>
                            <p className="text-muted small">Chuyên gia Sơn Mài</p>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="text-dark">
                            <img src="https://static.vinwonders.com/production/lang-gom-bat-trang-2.jpg" className="rounded-circle mb-3 shadow" style={{width: '100px', height: '100px', objectFit: 'cover'}} alt="Artist"/>
                            <h6 className="fw-bold" style={{fontSize: '0.9rem'}}>Làng Gốm Bát Tràng</h6>
                            <p className="text-muted small">Di sản gốm Việt</p>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="text-dark">
                            <img src="https://laodongthudo.vn/stores/news_dataimages/2022/112022/23/15/efcff360580f1ebc9292d6cd5e1f0293.jpg?rt=20221123152635" className="rounded-circle mb-3 shadow" style={{width: '100px', height: '100px', objectFit: 'cover'}} alt="Artist"/>
                            <h6 className="fw-bold" style={{fontSize: '0.9rem'}}>Nguyễn Văn Trúc</h6>
                            <p className="text-muted small">Nghệ nhân điêu khắc</p>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="text-dark">
                            <img src="https://upload.wikimedia.org/wikipedia/vi/0/0d/NguyenPhanChanh.jpg" className="rounded-circle mb-3 shadow" style={{width: '100px', height: '100px', objectFit: 'cover'}} alt="Artist"/>
                            <h6 className="fw-bold" style={{fontSize: '0.9rem'}}>Nguyễn Phan Chánh</h6>
                            <p className="text-muted small">Danh họa tranh lụa</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 4. TÁC PHẨM MỚI NHẤT */}
        <div className="mb-5">
            <div className="section-header">
              <div><h3 className="section-title">Tác Phẩm Mới Nhất</h3></div>
              <Link to="/shop" className="btn-view-all">Xem tất cả &rarr;</Link>
            </div>
            {products.length > 0 ? renderProductList(products.slice(0, 4)) : <p className="text-center">Đang tải...</p>}
        </div>

        {/* 5. TÁC PHẨM BÁN CHẠY */}
        <div className="mb-5">
            <div className="section-header">
              <div><h3 className="section-title">Tác Phẩm Bán Chạy</h3></div>
              <Link to="/shop" className="btn-view-all">Xem thêm &rarr;</Link>
            </div>
            {products.length > 4 
                ? renderProductList(products.slice(4, 8)) 
                : renderProductList(products.slice(0, 4))
            }
        </div>

      </div>
    </div>
  );
};

export default HomePage;