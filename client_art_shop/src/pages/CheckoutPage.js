import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckoutPage = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // --- FORM STATE ---
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  
  const [shippingMethod, setShippingMethod] = useState('standard'); 
  const [paymentMethod, setPaymentMethod] = useState('cod'); 

  // --- VOUCHER STATE ---
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // --- TÍNH TOÁN TIỀN ---
  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = shippingMethod === 'special' ? 500000 : 50000;
  
  // Tổng tiền = (Giá hàng - Giảm giá) + Ship
  // Lưu ý: Không để giá hàng bị âm
  const priceAfterDiscount = Math.max(0, itemsPrice - discountAmount);
  const totalPrice = priceAfterDiscount + shippingPrice;
  
  const totalUSD = (totalPrice / 24000).toFixed(2);

  // --- HÀM XỬ LÝ VOUCHER ---
  const applyCouponHandler = async () => {
      if(!couponCode.trim()) {
          toast.warning("Vui lòng nhập mã giảm giá");
          return;
      }
      try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.post('https://art-shop-fullstack.onrender.com/api/coupons/apply', { 
              code: couponCode, 
              orderTotal: itemsPrice 
          }, config);

          if (data.success) {
              setDiscountAmount(data.discountAmount);
              setIsCouponApplied(true);
              toast.success(`Áp dụng mã ${data.code} thành công! Giảm ${data.discountAmount.toLocaleString()}đ`);
          }
      } catch (error) {
          setDiscountAmount(0);
          setIsCouponApplied(false);
          toast.error(error.response?.data?.message || "Mã không hợp lệ hoặc đã hết hạn");
      }
  };

  // --- HÀM ĐẶT HÀNG ---
  const createOrder = async (paymentResult = {}) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const orderData = {
        orderItems: cart.map(item => ({
            name: item.name, qty: item.qty, imageUrl: item.imageUrl, price: item.price, product: item._id
        })),
        shippingAddress: { address, city, phone },
        paymentMethod,
        shippingMethod: shippingMethod === 'special' ? 'Vận chuyển đặc biệt (White-glove)' : 'Tiêu chuẩn',
        
        // Gửi các thông số tiền đã tính toán
        shippingPrice,
        totalPrice, // Tổng tiền cuối cùng đã trừ voucher + ship
        
        isPaid: paymentMethod === 'paypal' ? true : false,
        paymentResult
      };

      await axios.post('https://art-shop-fullstack.onrender.com/api/orders', orderData, config);
      
      toast.success("🎉 Đặt hàng thành công! Cảm ơn bạn.");
      localStorage.removeItem('cartItems'); 
      setCart([]); 
      setTimeout(() => { navigate('/orders'); }, 2000);

    } catch (error) {
      toast.error("Lỗi đặt hàng: " + error.message);
    }
  };

  const handlePlaceOrder = () => {
    if (!address || !city || !phone) {
        toast.warning("Vui lòng điền đầy đủ thông tin nhận hàng");
        return;
    }

    if (paymentMethod === 'momo') {
        const confirm = window.confirm(`Bạn đã quét mã và thanh toán ${totalPrice.toLocaleString()}đ thành công? (Bấm OK để xác nhận)`);
        if (confirm) {
            createOrder({ status: 'QR_Paid', id: 'TRANSFER_VN' });
        }
    } else {
        createOrder();
    }
  };

  if (cart.length === 0) return <div className="text-center mt-5">Giỏ hàng trống</div>;

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 fw-bold text-uppercase">Thanh Toán & Vận Chuyển</h2>
      <div className="row">
        
        {/* --- CỘT TRÁI: THÔNG TIN --- */}
        <div className="col-md-7">
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-white fw-bold">1. Thông tin nhận hàng</div>
                <div className="card-body">
                    <div className="mb-3"><label>Địa chỉ</label><input className="form-control" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Số nhà, tên đường..." required/></div>
                    <div className="row">
                        <div className="col-md-6 mb-3"><label>Thành phố</label><input className="form-control" value={city} onChange={e=>setCity(e.target.value)} required/></div>
                        <div className="col-md-6 mb-3"><label>Số điện thoại</label><input className="form-control" value={phone} onChange={e=>setPhone(e.target.value)} required/></div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-header bg-white fw-bold">2. Hình thức vận chuyển</div>
                <div className="card-body">
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="radio" name="shipping" checked={shippingMethod === 'standard'} onChange={()=>setShippingMethod('standard')}/>
                        <label className="form-check-label">Vận chuyển tiêu chuẩn - <strong>50,000 đ</strong></label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="shipping" checked={shippingMethod === 'special'} onChange={()=>setShippingMethod('special')}/>
                        <label className="form-check-label text-danger fw-bold">Vận chuyển đặc biệt (White-glove) - 500,000 đ</label>
                        <div className="small text-muted ms-3">* Dành cho tranh/tượng giá trị cao. Đóng thùng gỗ, xe chuyên dụng.</div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-header bg-white fw-bold">3. Phương thức thanh toán</div>
                <div className="card-body">
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={()=>setPaymentMethod('cod')}/>
                        <label className="form-check-label">Thanh toán khi nhận hàng (COD)</label>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="radio" name="payment" checked={paymentMethod === 'momo'} onChange={()=>setPaymentMethod('momo')}/>
                        <label className="form-check-label">Chuyển khoản ngân hàng / Quét mã QR</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="payment" checked={paymentMethod === 'paypal'} onChange={()=>setPaymentMethod('paypal')}/>
                        <label className="form-check-label">Thẻ Tín Dụng Quốc Tế / PayPal</label>
                    </div>
                </div>
            </div>
        </div>

        {/* --- CỘT PHẢI: TỔNG KẾT & VOUCHER --- */}
        <div className="col-md-5">
            <div className="card shadow border-0 bg-light">
                <div className="card-body">
                    <h4 className="fw-bold mb-3">Đơn Hàng</h4>
                    {cart.map(item => (
                        <div key={item._id} className="d-flex justify-content-between mb-2 small">
                            <span>{item.name} (x{item.qty})</span>
                            <span>{(item.price * item.qty).toLocaleString()} đ</span>
                        </div>
                    ))}
                    <hr/>
                    
                    {/* --- Ô NHẬP MÃ GIẢM GIÁ --- */}
                    <div className="input-group mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Mã giảm giá (VD: SALE50)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            disabled={isCouponApplied} 
                        />
                        <button 
                            className={`btn ${isCouponApplied ? 'btn-secondary' : 'btn-dark'}`} 
                            onClick={isCouponApplied ? () => {setIsCouponApplied(false); setDiscountAmount(0); setCouponCode('')} : applyCouponHandler}
                        >
                            {isCouponApplied ? 'Bỏ chọn' : 'Áp Dụng'}
                        </button>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                        <span>Tạm tính:</span><span className="fw-bold">{itemsPrice.toLocaleString()} đ</span>
                    </div>
                    
                    {/* Hiển thị dòng giảm giá (nếu có) */}
                    <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Giảm giá (Voucher):</span>
                        <span className="fw-bold">-{discountAmount.toLocaleString()} đ</span>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                        <span>Vận chuyển:</span><span className="fw-bold">{shippingPrice.toLocaleString()} đ</span>
                    </div>
                    <hr/>
                    <div className="d-flex justify-content-between mb-4">
                        <span className="h5 fw-bold">Tổng cộng:</span>
                        <span className="h4 fw-bold text-danger">{totalPrice.toLocaleString()} đ</span>
                    </div>

                    {/* MÃ QR MOMO (CẬP NHẬT THEO GIÁ MỚI) */}
                    {paymentMethod === 'momo' && (
                        <div className="text-center mb-4 p-3 bg-white rounded border">
                            <h6 className="fw-bold text-primary mb-2">QUÉT MÃ ĐỂ THANH TOÁN</h6>
                            <img src={`https://img.vietqr.io/image/VCB-9338493544-compact.jpg?amount=${totalPrice}&addInfo=Thanh toan don hang`} alt="QR" className="img-fluid mb-2" style={{maxWidth: '200px'}}/>
                            <div className="small"><strong>VCB:</strong> 9338493544</div>
                        </div>
                    )}

                    {/* NÚT PAYPAL */}
                    {paymentMethod === 'paypal' ? (
                        <PayPalScriptProvider options={{ "client-id": "AVSRUP65csLyFRCFwRXJnC2CtIXcUIL26Vm_JbN9oyPN3O4mDt23jLH0TKUSk3p2iLnq1IavzBaxGBB6", "currency": "USD" }}>
                            <PayPalButtons 
                                style={{ layout: "vertical" }}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [{ amount: { value: totalUSD } }]
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    return actions.order.capture().then((details) => {
                                        createOrder(details);
                                    });
                                }}
                            />
                        </PayPalScriptProvider>
                    ) : (
                        <button onClick={handlePlaceOrder} className="btn btn-success w-100 py-3 fw-bold text-uppercase">
                            {paymentMethod === 'cod' ? 'Đặt Hàng Ngay' : 'Tôi Đã Thanh Toán'}
                        </button>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;