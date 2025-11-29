import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

  // Kiểm tra quyền Admin khi vào trang
  useEffect(() => {
    if (!adminInfo || !adminInfo.isAdmin) {
        navigate('/login');
    } else {
        fetchProducts();
    }
  }, [navigate, adminInfo]);

  // Hàm lấy danh sách sản phẩm từ Server
  const fetchProducts = async () => {
    try {
        const { data } = await axios.get('https://art-shop-fullstack.onrender.com/api/products');
        setProducts(data);
    } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm");
    }
  };

  // Hàm xóa sản phẩm
  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tác phẩm này không?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        await axios.delete(`https://art-shop-fullstack.onrender.com/api/products/${id}`, config);
        fetchProducts(); // Tải lại danh sách sau khi xóa
      } catch (error) { 
        alert('Lỗi xóa sản phẩm'); 
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-dark fw-bold">Danh Sách Sản Phẩm</h2>
          <Link to="/product/new" className="btn btn-success shadow-sm">
            <i className="bi bi-plus-circle"></i> + Thêm Mới
          </Link>
        </div>

        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0">
                <thead className="table-dark">
                  <tr>
                    <th style={{width: '10%'}} className="text-center">Ảnh</th>
                    <th style={{width: '30%'}}>Tên Tác Phẩm</th>
                    
                    {/* --- CỘT MỚI: DANH MỤC --- */}
                    <th style={{width: '15%'}}>Danh Mục</th>
                    
                    <th style={{width: '20%'}}>Giá Bán</th>
                    <th style={{width: '25%'}} className="text-center">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} className="align-middle">
                      <td className="text-center">
                        <img 
                            src={p.imageUrl} 
                            alt={p.name} 
                            style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd'}} 
                        />
                      </td>
                      <td>
                          <div className="fw-bold">{p.name}</div>
                          <small className="text-muted">Tác giả: {p.author || 'Chưa rõ'}</small>
                      </td>
                      
                      {/* --- HIỂN THỊ CỘT DANH MỤC --- */}
                      <td>
                          <span className="badge bg-info text-dark">
                              {p.category || 'Chưa phân loại'}
                          </span>
                      </td>

                      <td className="fw-bold text-danger">
                        {p.price.toLocaleString()} đ
                      </td>
                      <td className="text-center">
                        <Link to={`/product/${p._id}`} className="btn btn-primary btn-sm me-2">
                          Sửa
                        </Link>
                        <button onClick={() => deleteHandler(p._id)} className="btn btn-danger btn-sm">
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {products.length === 0 && (
                      <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">
                              Chưa có sản phẩm nào. Hãy bấm "Thêm Mới".
                          </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;