import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ProductEditPage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  
  // Danh mục
  const [categories, setCategories] = useState([]); 
  const [category, setCategory] = useState('');

  // --- STATE MỚI ---
  const [material, setMaterial] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [status, setStatus] = useState('Còn hàng');

  const navigate = useNavigate();
  const { id } = useParams();
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

  // Dữ liệu mẫu cho Dropdown (để chọn cho nhanh)
  const materials = ["Sơn dầu", "Sơn mài", "Lụa", "Gỗ", "Gốm", "Đồng", "Giấy Dó", "Khác"];
  const colors = ["Đỏ", "Xanh dương", "Xanh lá", "Vàng", "Trắng", "Đen", "Nâu", "Đa sắc"];
  const statuses = ["Còn hàng", "Đã bán", "Đặt trước"];

  // 1. Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('https://localhost:5000/api/categories');
            setCategories(data);
        } catch (error) { console.error(error); }
    };
    fetchCategories();
  }, []);

  // 2. Lấy chi tiết sản phẩm để sửa
  useEffect(() => {
    if (!localStorage.getItem('adminInfo')) {
        navigate('/login');
        return;
    }
    if (id !== 'new') {
      const fetchProduct = async () => {
          try {
            const { data } = await axios.get(`https://localhost:5000/api/products/${id}`);
            setName(data.name || '');
            setPrice(data.price || 0);
            setImageUrl(data.imageUrl || '');
            setCategory(data.category || ''); 
            setAuthor(data.author || '');
            setDescription(data.description || '');
            
            // Set dữ liệu mới
            setMaterial(data.material || 'Khác');
            setSize(data.size || '');
            setColor(data.color || 'Đa sắc');
            setStatus(data.status || 'Còn hàng');
          } catch (error) { console.error(error); }
      };
      fetchProduct();
    }
    // eslint-disable-next-line
  }, [id]); 

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!adminInfo) return;
    const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
    
    // Gửi toàn bộ dữ liệu lên server
    const data = { 
        name, price, imageUrl, category, author, description,
        material, size, color, status 
    };

    try {
      if (id !== 'new') await axios.put(`https://localhost:5000/api/products/${id}`, data, config);
      else await axios.post('https://localhost:5000/api/products', data, config);
      navigate('/'); 
    } catch (err) { alert('Lỗi lưu dữ liệu'); }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4 mb-5">
        <div className="row justify-content-center">
            <div className="col-md-8">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h3 className="mb-4 text-center">{id === 'new' ? 'Thêm Mới' : 'Cập Nhật'}</h3>
                        <form onSubmit={submitHandler}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="fw-bold">Tên Sản Phẩm</label>
                                    <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="fw-bold">Giá (VNĐ)</label>
                                    <input type="number" className="form-control" value={price} onChange={e=>setPrice(e.target.value)} required/>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="fw-bold">Link Ảnh (URL)</label>
                                <input className="form-control" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} required/>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="fw-bold">Danh mục</label>
                                    <select className="form-select" value={category} onChange={e=>setCategory(e.target.value)} required>
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="fw-bold">Tác giả</label>
                                    <input className="form-control" value={author} onChange={e=>setAuthor(e.target.value)}/>
                                </div>
                            </div>

                            {/* --- KHU VỰC THÔNG TIN BỔ SUNG --- */}
                            <div className="row bg-light p-3 rounded mb-3 border">
                                <div className="col-md-6 mb-3">
                                    <label className="fw-bold">Chất liệu</label>
                                    <select className="form-select" value={material} onChange={e=>setMaterial(e.target.value)}>
                                        {materials.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="fw-bold">Màu chủ đạo</label>
                                    <select className="form-select" value={color} onChange={e=>setColor(e.target.value)}>
                                        {colors.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="fw-bold">Kích thước</label>
                                    <input className="form-control" placeholder="VD: 30x40 cm" value={size} onChange={e=>setSize(e.target.value)}/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="fw-bold">Tình trạng</label>
                                    <select className="form-select" value={status} onChange={e=>setStatus(e.target.value)}>
                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="fw-bold">Mô tả chi tiết</label>
                                <textarea className="form-control" rows="4" value={description} onChange={e=>setDescription(e.target.value)}/>
                            </div>
                            
                            <div className="d-grid gap-2">
                                <button className="btn btn-success">Lưu Lại</button>
                                <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;