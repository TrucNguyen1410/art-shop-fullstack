import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [activeReviewId, setActiveReviewId] = useState(null); // ID của review đang soạn trả lời
  
  const navigate = useNavigate();
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

  useEffect(() => {
    if (!adminInfo || !adminInfo.isAdmin) {
        navigate('/login');
    } else {
        fetchReviews();
    }
  }, [navigate, adminInfo]);

  const fetchReviews = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        // Gọi API vừa tạo ở Backend (Nhớ đổi https nếu bạn đang dùng SSL)
        const { data } = await axios.get('https://localhost:5000/api/products/admin/reviews', config);
        setReviews(data);
    } catch (error) {
        console.error("Lỗi tải đánh giá");
    }
  };

  const submitReplyHandler = async (productId, reviewId) => {
      try {
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        // Gọi API trả lời đánh giá (Đã có từ trước)
        await axios.put(`https://localhost:5000/api/products/${productId}/reviews/${reviewId}/reply`, { reply: replyText }, config);
        
        alert("Đã trả lời thành công!");
        setReplyText('');
        setActiveReviewId(null);
        fetchReviews(); // Tải lại danh sách
      } catch (error) {
          alert("Lỗi khi trả lời");
      }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4 mb-5">
        <h2 className="mb-4">Quản Lý Đánh Giá Khách Hàng</h2>
        
        <div className="table-responsive">
            <table className="table table-bordered table-hover shadow-sm bg-white">
                <thead className="table-dark">
                    <tr>
                        <th style={{width: '25%'}}>Sản Phẩm</th>
                        <th style={{width: '15%'}}>Khách Hàng</th>
                        <th style={{width: '10%'}}>Đánh Giá</th>
                        <th style={{width: '25%'}}>Nội Dung</th>
                        <th style={{width: '25%'}}>Phản Hồi Của Shop</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.length === 0 ? (
                        <tr><td colSpan="5" className="text-center">Chưa có đánh giá nào.</td></tr>
                    ) : (
                        reviews.map((rev) => (
                            <tr key={rev._id}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <img src={rev.productImage} alt="" style={{width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px'}}/>
                                        <span className="small fw-bold">{rev.productName}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="fw-bold">{rev.userName}</div>
                                    <small className="text-muted">{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</small>
                                </td>
                                <td className="text-center">
                                    <span className="text-warning fw-bold">{rev.rating} ★</span>
                                </td>
                                <td>
                                    <p className="mb-0 text-secondary">"{rev.comment}"</p>
                                </td>
                                <td>
                                    {rev.adminReply ? (
                                        <div className="alert alert-success py-1 px-2 small mb-0">
                                            <i className="bi bi-check-circle me-1"></i> {rev.adminReply}
                                        </div>
                                    ) : (
                                        // Form trả lời (Hiện khi bấm nút hoặc chưa trả lời)
                                        activeReviewId === rev._id ? (
                                            <div>
                                                <textarea 
                                                    className="form-control mb-2" 
                                                    rows="2" 
                                                    placeholder="Nhập câu trả lời..."
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                ></textarea>
                                                <button className="btn btn-sm btn-primary me-2" onClick={() => submitReplyHandler(rev.productId, rev._id)}>Gửi</button>
                                                <button className="btn btn-sm btn-secondary" onClick={() => setActiveReviewId(null)}>Hủy</button>
                                            </div>
                                        ) : (
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => setActiveReviewId(rev._id)}>
                                                <i className="bi bi-reply-fill"></i> Trả lời
                                            </button>
                                        )
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewListPage;