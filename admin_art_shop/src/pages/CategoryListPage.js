import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // --- SỬA THÀNH HTTPS ---
      const { data } = await axios.get('https://art-shop-fullstack.onrender.com/api/categories');
      setCategories(data);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory) return;
    try {
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        // --- SỬA THÀNH HTTPS ---
        await axios.post('https://art-shop-fullstack.onrender.com/api/categories', { name: newCategory }, config);
        setNewCategory('');
        fetchCategories(); 
    } catch (error) {
        alert('Danh mục đã tồn tại hoặc lỗi server');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa danh mục này?')) {
        try {
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
            // --- SỬA THÀNH HTTPS ---
            await axios.delete(`https://art-shop-fullstack.onrender.com/api/categories/${id}`, config);
            fetchCategories();
        } catch (error) {
            alert('Lỗi khi xóa');
        }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
            {/* Form Thêm nhanh */}
            <div className="col-md-4 mb-4">
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">Thêm Danh Mục</div>
                    <div className="card-body">
                        <form onSubmit={handleAddCategory}>
                            <div className="mb-3">
                                <label>Tên Danh Mục</label>
                                <input 
                                    type="text" className="form-control" 
                                    value={newCategory} 
                                    onChange={(e) => setNewCategory(e.target.value)} 
                                    placeholder="VD: Tranh sơn dầu..."
                                />
                            </div>
                            <button className="btn btn-success w-100">Lưu Lại</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Danh sách */}
            <div className="col-md-8">
                <h3>Danh Sách Danh Mục</h3>
                <table className="table table-bordered table-hover bg-white shadow-sm">
                    <thead className="table-light">
                        <tr>
                            <th>Tên Danh Mục</th>
                            <th style={{width: '100px'}}>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat._id}>
                                <td>{cat.name}</td>
                                <td>
                                    <button onClick={() => handleDelete(cat._id)} className="btn btn-danger btn-sm">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryListPage;