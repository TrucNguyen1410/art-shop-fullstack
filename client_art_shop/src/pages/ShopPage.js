import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  
  // State cho bộ lọc
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [status, setStatus] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Dữ liệu cho Dropdown
  const categoriesList = ["Tranh", "Tượng", "Gốm", "Văn hóa Việt Nam"];
  const materialsList = ["Sơn dầu", "Sơn mài", "Lụa", "Gỗ", "Gốm", "Đồng", "Giấy Dó", "Khác"];
  const colorsList = ["Đỏ", "Xanh dương", "Xanh lá", "Vàng", "Trắng", "Đen", "Nâu", "Đa sắc"];

  const location = useLocation();
  const navigate = useNavigate();

  // 1. Đọc URL và cập nhật State khi URL thay đổi
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setKeyword(params.get('keyword') || '');
    setCategory(params.get('category') || '');
    setMaterial(params.get('material') || '');
    setColor(params.get('color') || '');
    setStatus(params.get('status') || '');
    setMinPrice(params.get('minPrice') || '');
    setMaxPrice(params.get('maxPrice') || '');

    fetchProducts(params);
  }, [location.search]);

  // 2. Gọi API lấy sản phẩm
  const fetchProducts = async (params) => {
    let url = `https://art-shop-fullstack.onrender.com/api/products?` + params.toString();
    try {
      const { data } = await axios.get(url);
      setProducts(data);
    } catch (error) {
      console.error("Lỗi tải sản phẩm");
    }
  };

  // 3. Hàm áp dụng bộ lọc (Đẩy tham số lên URL)
  const applyFilter = () => {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (category) params.set('category', category);
    if (material) params.set('material', material);
    if (color) params.set('color', color);
    if (status) params.set('status', status);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    navigate(`/shop?${params.toString()}`);
  };

  // 4. Xóa bộ lọc
  const clearFilter = () => {
    setKeyword('');
    setCategory('');
    setMaterial('');
    setColor('');
    setStatus('');
    setMinPrice('');
    setMaxPrice('');
    navigate('/shop');
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row">
        
        {/* --- CỘT BÊN TRÁI: BỘ LỌC (SIDEBAR) --- */}
        <div className="col-md-3 mb-4">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white fw-bold text-uppercase" style={{color: '#e65100'}}>
                    <i className="bi bi-funnel"></i> Bộ Lọc Tìm Kiếm
                </div>
                <div className="card-body">
                    
                    {/* Tìm tên / nghệ sĩ */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small">Tìm kiếm</label>
                        <input className="form-control form-control-sm" placeholder="Tên tác phẩm, nghệ sĩ..." value={keyword} onChange={e=>setKeyword(e.target.value)}/>
                    </div>

                    {/* Danh mục */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small">Danh mục</label>
                        <select className="form-select form-select-sm" value={category} onChange={e=>setCategory(e.target.value)}>
                            <option value="">Tất cả</option>
                            {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Khoảng giá */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small">Khoảng giá (VNĐ)</label>
                        <div className="d-flex gap-1">
                            <input type="number" className="form-control form-control-sm" placeholder="Từ" value={minPrice} onChange={e=>setMinPrice(e.target.value)}/>
                            <input type="number" className="form-control form-control-sm" placeholder="Đến" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)}/>
                        </div>
                    </div>

                    {/* Chất liệu */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small">Chất liệu</label>
                        <select className="form-select form-select-sm" value={material} onChange={e=>setMaterial(e.target.value)}>
                            <option value="">Tất cả</option>
                            {materialsList.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    {/* Màu sắc */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small">Màu chủ đạo</label>
                        <select className="form-select form-select-sm" value={color} onChange={e=>setColor(e.target.value)}>
                            <option value="">Tất cả</option>
                            {colorsList.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Tình trạng */}
                    <div className="mb-3">
                        <label className="form-label fw-bold small">Tình trạng</label>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="status" checked={status === ''} onChange={()=>setStatus('')}/>
                            <label className="form-check-label small">Tất cả</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="status" checked={status === 'Còn hàng'} onChange={()=>setStatus('Còn hàng')}/>
                            <label className="form-check-label small">Còn hàng</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="status" checked={status === 'Đã bán'} onChange={()=>setStatus('Đã bán')}/>
                            <label className="form-check-label small">Đã bán</label>
                        </div>
                    </div>

                    <div className="d-grid gap-2">
                        <button className="btn btn-dark btn-sm" style={{backgroundColor: '#e65100', border: 'none'}} onClick={applyFilter}>Áp Dụng Lọc</button>
                        <button className="btn btn-outline-secondary btn-sm" onClick={clearFilter}>Xóa Lọc</button>
                    </div>

                </div>
            </div>
        </div>

        {/* --- CỘT BÊN PHẢI: KẾT QUẢ TÌM KIẾM --- */}
        <div className="col-md-9">
            <h4 className="mb-3 fw-bold">Kết Quả ({products.length} tác phẩm)</h4>
            
            <div className="product-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}> 
                {products.length > 0 ? (
                products.map((product) => (
                    <Link to={`/product/${product._id}`} key={product._id} className="text-decoration-none">
                    <div className="product-card-home">
                        <div className="product-img-container">
                            <img src={product.imageUrl} className="product-img-home" alt={product.name} />
                            {/* Badge tình trạng */}
                            {product.status && product.status !== 'Còn hàng' && (
                                <div className="position-absolute top-0 end-0 bg-secondary text-white px-2 py-1 small m-2 rounded shadow-sm" style={{fontSize: '0.7rem'}}>
                                    {product.status}
                                </div>
                            )}
                        </div>

                        <div className="product-info-home">
                        <h5 title={product.name}>{product.name}</h5>
                        
                        <div className="mt-2">
                            <div className="d-flex align-items-center justify-content-between">
                                <span className="price-current">{product.price.toLocaleString()}đ</span>
                                <span className="btn btn-sm btn-outline-dark rounded-pill px-3" style={{fontSize: '0.8rem'}}>
                                    Xem chi tiết
                                </span>
                            </div>
                        </div>
                        </div>
                    </div>
                    </Link>
                ))
                ) : (
                <div className="col-12 text-center py-5">
                    <h4 className="text-muted">Không tìm thấy sản phẩm nào phù hợp.</h4>
                    <button className="btn btn-link text-decoration-none" onClick={clearFilter}>Xóa bộ lọc để xem tất cả</button>
                </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ShopPage;