import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  // Form state
  const [code, setCode] = useState('');
  const [type, setType] = useState('percent'); // percent hoặc fixed
  const [value, setValue] = useState(0);
  const [count, setCount] = useState(100);
  const [expiry, setExpiry] = useState('');

  const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        const { data } = await axios.get('https://localhost:5000/api/coupons', config);
        setCoupons(data);
    } catch (error) { console.error("Lỗi tải mã"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        await axios.post('https://localhost:5000/api/coupons', {
            code, type, value, countInStock: count, expiryDate: expiry
        }, config);
        alert("Tạo mã thành công!");
        fetchCoupons();
        setCode(''); setValue(0); // Reset form
    } catch (error) {
        alert(error.response?.data?.message || "Lỗi tạo mã");
    }
  };

  const handleDelete = async (id) => {
      if(window.confirm("Xóa mã này?")) {
        try {
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
            await axios.delete(`https://localhost:5000/api/coupons/${id}`, config);
            fetchCoupons();
        } catch (error) { alert("Lỗi xóa"); }
      }
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4">Quản Lý Mã Giảm Giá</h2>
        <div className="row">
            {/* Form Tạo Mã */}
            <div className="col-md-4">
                <div className="card shadow-sm">
                    <div className="card-header bg-success text-white">Tạo Mã Mới</div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>Mã Code (VD: SALE50)</label>
                                <input className="form-control text-uppercase" value={code} onChange={e=>setCode(e.target.value)} required/>
                            </div>
                            <div className="mb-3">
                                <label>Loại giảm giá</label>
                                <select className="form-select" value={type} onChange={e=>setType(e.target.value)}>
                                    <option value="percent">Giảm theo %</option>
                                    <option value="fixed">Giảm tiền mặt (VNĐ)</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label>Giá trị giảm ({type === 'percent' ? '%' : 'VNĐ'})</label>
                                <input type="number" className="form-control" value={value} onChange={e=>setValue(e.target.value)} required/>
                            </div>
                            <div className="mb-3">
                                <label>Số lượng mã</label>
                                <input type="number" className="form-control" value={count} onChange={e=>setCount(e.target.value)} required/>
                            </div>
                            <div className="mb-3">
                                <label>Hạn sử dụng</label>
                                <input type="date" className="form-control" value={expiry} onChange={e=>setExpiry(e.target.value)} required/>
                            </div>
                            <button className="btn btn-success w-100">Tạo Mã</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Danh sách mã */}
            <div className="col-md-8">
                <table className="table table-bordered bg-white shadow-sm">
                    <thead className="table-light">
                        <tr>
                            <th>Code</th>
                            <th>Giảm</th>
                            <th>SL Còn</th>
                            <th>Hết Hạn</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(c => (
                            <tr key={c._id}>
                                <td className="fw-bold text-success">{c.code}</td>
                                <td>{c.type === 'percent' ? `${c.value}%` : `${c.value.toLocaleString()}đ`}</td>
                                <td>{c.countInStock}</td>
                                <td>{new Date(c.expiryDate).toLocaleDateString('vi-VN')}</td>
                                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}>Xóa</button></td>
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

export default CouponPage;