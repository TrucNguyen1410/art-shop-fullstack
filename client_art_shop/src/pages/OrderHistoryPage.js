import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('shipping');
  
  // State Modal Đánh giá
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null); 
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
        navigate('/login');
    } else {
        fetchOrders();
    }
  }, [navigate]);

  const fetchOrders = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        // Đảm bảo link là HTTPS
        const { data } = await axios.get('https://art-shop-fullstack.onrender.com/api/orders/myorders', config);
        setOrders(data);
    } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
    }
  };

  const openReviewModal = (item, orderId) => {
      setReviewProduct({ ...item, orderId });
      setRating(5);
      setComment('');
      setShowReviewModal(true);
  };

  const submitReviewHandler = async () => {
      if(!comment.trim()) { toast.warn("Hãy nhập nội dung đánh giá"); return; }
      try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          await axios.post(`https://art-shop-fullstack.onrender.com/api/products/${reviewProduct.product}/reviews`, { 
              rating, comment 
          }, config);

          toast.success("Đánh giá thành công!");
          setShowReviewModal(false);
          fetchOrders(); // Tải lại để cập nhật trạng thái
      } catch (error) {
          toast.error(error.response?.data?.message || "Lỗi gửi đánh giá");
      }
  };

  const shippingOrders = orders.filter(order => !order.isDelivered); 
  const completedOrders = orders.filter(order => order.isDelivered); 
  const displayedOrders = activeTab === 'shipping' ? shippingOrders : completedOrders;

  const calculateItemsPrice = (items) => {
      return items.reduce((acc, item) => acc + item.price * item.qty, 0);
  };

  const getPaymentMethodName = (method) => {
      switch(method) {
          case 'cod': return 'Thanh toán khi nhận hàng (COD)';
          case 'momo': return 'Ví MoMo / VNPay';
          case 'paypal': return 'Thẻ quốc tế / PayPal';
          default: return method;
      }
  };

  return (
    <div style={{ backgroundColor: '#fdfbf7', minHeight: '100vh', paddingBottom: '50px' }}>
      <div className="container pt-4">
        <h4 className="mb-4 fw-bold text-uppercase border-bottom pb-2" style={{color: '#5a3e2b'}}>Lịch sử đơn hàng</h4>

        {/* --- THANH TAB --- */}
        <div className="d-flex mb-4 shadow-sm rounded overflow-hidden" style={{border: '1px solid #eee'}}>
            <button 
                className="flex-grow-1 btn rounded-0 py-3 fw-bold transition-all"
                onClick={() => setActiveTab('shipping')}
                style={{
                    backgroundColor: activeTab === 'shipping' ? '#fff3e0' : '#fff', 
                    color: activeTab === 'shipping' ? '#e65100' : '#888',
                    borderBottom: activeTab === 'shipping' ? '3px solid #e65100' : 'none',
                    borderRight: '1px solid #eee'
                }}
            >
                <i className="bi bi-truck me-2"></i> Đang Giao Hàng ({shippingOrders.length})
            </button>
            <button 
                className="flex-grow-1 btn rounded-0 py-3 fw-bold transition-all"
                onClick={() => setActiveTab('completed')}
                style={{
                    backgroundColor: activeTab === 'completed' ? '#e8f5e9' : '#fff', 
                    color: activeTab === 'completed' ? '#2e7d32' : '#888',
                    borderBottom: activeTab === 'completed' ? '3px solid #2e7d32' : 'none'
                }}
            >
                <i className="bi bi-check-circle-fill me-2"></i> Đã Giao Thành Công ({completedOrders.length})
            </button>
        </div>

        {/* --- DANH SÁCH ĐƠN HÀNG --- */}
        {displayedOrders.length === 0 ? (
            <div className="text-center py-5 bg-white rounded shadow-sm border">
                <div className="mb-3 text-muted" style={{fontSize: '3rem'}}><i className="bi bi-inbox"></i></div>
                <p className="mt-3 text-muted">
                    {activeTab === 'shipping' ? 'Hiện không có đơn hàng nào đang giao.' : 'Bạn chưa có đơn hàng nào hoàn tất.'}
                </p>
            </div>
        ) : (
            displayedOrders.map((order) => (
                <div key={order._id} className="order-card mb-3 bg-white shadow-sm rounded border">
                    
                    <div className="order-header p-3 border-bottom d-flex justify-content-between align-items-center" style={{backgroundColor: '#fafafa'}}>
                        <div className="fw-bold" style={{color: '#333'}}>
                            <i className="bi bi-shop me-2 text-muted"></i>ART SHOP OFFICIAL
                        </div>
                        <div className="text-uppercase fw-bold" style={{fontSize: '0.85rem'}}>
                            {order.isDelivered ? (
                                <span style={{color: '#2e7d32'}}><i className="bi bi-check-circle-fill me-1"></i> GIAO HÀNG THÀNH CÔNG</span>
                            ) : (
                                <span style={{color: '#e65100'}}><i className="bi bi-truck me-1"></i> ĐANG VẬN CHUYỂN</span>
                            )}
                            <span className="mx-2 text-muted">|</span>
                            <span className="text-muted" style={{fontSize: '0.8rem'}}>
                                {getPaymentMethodName(order.paymentMethod).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {order.orderItems.map((item, index) => (
                        <div key={index} className="p-3 border-bottom">
                            <div className="d-flex">
                                <img src={item.imageUrl} alt={item.name} style={{width: '80px', height: '80px', objectFit: 'cover', border: '1px solid #f0f0f0', borderRadius: '4px'}} className="me-3"/>
                                <div className="flex-grow-1">
                                    <h6 className="mb-1 text-dark">{item.name}</h6>
                                    <small className="text-muted">x{item.qty}</small>
                                </div>
                                <div className="text-end">
                                    <span style={{color: '#e65100'}}>{item.price.toLocaleString()}đ</span>
                                </div>
                            </div>

                            {/* HIỂN THỊ REVIEW NẾU ĐÃ GIAO */}
                            {order.isDelivered && (
                                <div className="mt-3">
                                    {item.myReview ? (
                                        <div className="bg-light p-3 rounded border">
                                            <div className="d-flex align-items-center mb-1">
                                                <small className="fw-bold me-2 text-muted">Đánh giá của bạn:</small>
                                                <div className="text-warning">
                                                    {[...Array(5)].map((_, i) => <FaStar key={i} size={12} color={i < item.myReview.rating ? '#ffc107' : '#ddd'} />)}
                                                </div>
                                            </div>
                                            <div className="small text-dark mb-2">"{item.myReview.comment}"</div>
                                            
                                            {item.myReview.adminReply && (
                                                <div className="mt-2 pt-2 border-top">
                                                    <small className="text-danger fw-bold"><i className="bi bi-shop"></i> Phản hồi của Shop:</small>
                                                    <div className="small text-muted fst-italic mt-1">{item.myReview.adminReply}</div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-end">
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => openReviewModal(item, order._id)}>
                                                <i className="bi bi-pencil-square me-1"></i> Viết Đánh Giá
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="order-footer p-3 bg-light text-end">
                        <span className="me-3">Thành tiền:</span>
                        <span className="fs-5 fw-bold" style={{color: '#e65100'}}>{order.totalPrice.toLocaleString()}đ</span>
                        <button 
                            className="btn px-4 shadow-sm ms-3 fw-bold" 
                            style={{backgroundColor: 'white', color: '#e65100', border: '1px solid #e65100'}}
                            onClick={() => setSelectedOrder(order)}
                        >
                            Xem Chi Tiết Đơn
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* --- MODAL ĐÁNH GIÁ --- */}
      {showReviewModal && (
        <div className="review-modal-overlay">
            <div className="review-modal-content">
                <div className="review-header fw-bold">Đánh Giá Sản Phẩm</div>
                <div className="review-body">
                    <div className="d-flex align-items-center mb-3">
                        <img src={reviewProduct.imageUrl} alt="" style={{width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px'}} />
                        <div className="fw-bold text-truncate">{reviewProduct.name}</div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                        <span className="me-3">Chất lượng:</span>
                        <div className="star-widget">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar key={star} size={30} style={{cursor: 'pointer', marginRight: '5px'}} color={star <= rating ? "#ffc107" : "#e4e5e9"} onClick={() => setRating(star)} />
                            ))}
                        </div>
                    </div>
                    <textarea className="review-textarea" placeholder="Chia sẻ cảm nhận..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                </div>
                <div className="review-footer">
                    <button className="btn-back" onClick={() => setShowReviewModal(false)}>TRỞ LẠI</button>
                    <button className="btn-submit-review" onClick={submitReviewHandler}>HOÀN THÀNH</button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL CHI TIẾT --- */}
      {selectedOrder && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header text-white" style={{backgroundColor: '#e65100'}}>
                <h5 className="modal-title fw-bold">Chi Tiết Đơn Hàng #{selectedOrder._id.substring(0, 8)}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedOrder(null)}></button>
              </div>
              <div className="modal-body">
                  <p><strong>Người nhận:</strong> {userInfo.username}</p>
                  <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}</p>
                  <p><strong>SĐT:</strong> {selectedOrder.shippingAddress.phone}</p>
                  <hr/>
                  <h5 className="text-end text-danger fw-bold">Tổng: {selectedOrder.totalPrice.toLocaleString()}đ</h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;