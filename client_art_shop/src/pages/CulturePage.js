import React from 'react';
import { Link } from 'react-router-dom';

const CulturePage = () => {
  return (
    <div>
      {/* 1. HERO BANNER: Phong cảnh Việt Nam */}
      <div 
        className="position-relative text-center text-white d-flex align-items-center justify-content-center"
        style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", // Ảnh Hội An/Việt Nam
            height: '500px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: '50px'
        }}
      >
        <div style={{backgroundColor: 'rgba(0,0,0,0.5)', padding: '40px', borderRadius: '10px'}}>
            <h1 className="display-3 fw-bold">Hồn Việt Trong Từng Nét Vẽ</h1>
            <p className="lead">Khám phá vẻ đẹp bất tận của nghệ thuật truyền thống và phong cảnh Việt Nam.</p>
        </div>
      </div>

      <div className="container">
        
        {/* 2. GIỚI THIỆU CHUNG */}
        <div className="row mb-5 text-center">
            <div className="col-md-8 mx-auto">
                <h2 className="fw-bold mb-3" style={{color: '#8b4513'}}>Tinh Hoa Văn Hóa</h2>
                <p className="text-muted" style={{fontSize: '1.1rem'}}>
                    Nghệ thuật Việt Nam không chỉ là những tác phẩm vô tri, mà là sự kết tinh của ngàn năm lịch sử. 
                    Từ những nét vẽ dân gian mộc mạc, những thớ đất nung qua lửa đỏ, đến những bức tượng điêu khắc 
                    chứa đựng tâm linh. Chúng tôi tự hào mang đến không gian văn hóa đậm đà bản sắc dân tộc.
                </p>
                <hr className="w-25 mx-auto mt-4" style={{borderTop: '3px solid #e65100'}} />
            </div>
        </div>

        {/* 3. KHỐI NGHỆ THUẬT: TRANH */}
        <div className="row align-items-center mb-5">
            <div className="col-md-6">
                <img 
                    src="https://cdn.arttimes.vn/upload/2-2024/images/2024-04-08/1712542930-2k.jpg" 
                    alt="Tranh nghệ thuật" 
                    className="img-fluid rounded shadow-lg"
                />
            </div>
            <div className="col-md-6 p-5">
                <h3 className="fw-bold mb-3 text-uppercase" style={{color: '#e65100'}}>Nghệ Thuật Tranh</h3>
                <p>
                    Tranh Việt Nam nổi tiếng với các dòng tranh dân gian như Đông Hồ, Hàng Trống, 
                    cho đến nghệ thuật tranh sơn mài và tranh lụa hiện đại. Mỗi bức tranh là một câu chuyện, 
                    phản ánh đời sống sinh hoạt, ước mơ và khát vọng của người Việt xưa và nay.
                </p>
                <Link to="/shop?category=Tranh" className="btn btn-outline-dark mt-3">Xem Bộ Sưu Tập Tranh</Link>
            </div>
        </div>

        {/* 4. KHỐI NGHỆ THUẬT: GỐM (Đảo ngược vị trí ảnh) */}
        <div className="row align-items-center mb-5 flex-row-reverse">
            <div className="col-md-6">
                <img 
                    src="https://www.gomnghethuat.com/wp-content/uploads/Top-10-Lang-Gom-Noi-Tieng-o-Viet-Nam.jpg" 
                    alt="Gốm sứ" 
                    className="img-fluid rounded shadow-lg"
                />
            </div>
            <div className="col-md-6 p-5">
                <h3 className="fw-bold mb-3 text-uppercase" style={{color: '#e65100'}}>Tinh Hoa Gốm Sứ</h3>
                <p>
                    Gốm Bát Tràng, Chu Đậu... là niềm tự hào của thủ công mỹ nghệ Việt. 
                    Từ nắm đất sét vô hồn, qua bàn tay tài hoa của nghệ nhân và ngọn lửa lò nung, 
                    những tác phẩm gốm sứ ra đời với vẻ đẹp tinh xảo, nước men độc đáo trường tồn với thời gian.
                </p>
                <Link to="/shop?category=Gốm" className="btn btn-outline-dark mt-3">Xem Bộ Sưu Tập Gốm</Link>
            </div>
        </div>

        {/* 5. KHỐI NGHỆ THUẬT: TƯỢNG */}
        <div className="row align-items-center mb-5">
            <div className="col-md-6">
                <img 
                    src="https://imagevietnam.vnanet.vn/Upload//2014/5/30/3005201416053050DoGo5.jpg" 
                    alt="Tượng điêu khắc" 
                    className="img-fluid rounded shadow-lg"
                />
            </div>
            <div className="col-md-6 p-5">
                <h3 className="fw-bold mb-3 text-uppercase" style={{color: '#e65100'}}>Điêu Khắc & Tượng</h3>
                <p>
                    Nghệ thuật điêu khắc tượng gỗ và đá mang đậm dấu ấn tâm linh và văn hóa tín ngưỡng. 
                    Những bức tượng không chỉ để trang trí mà còn mang ý nghĩa phong thủy, cầu bình an 
                    và tài lộc cho gia chủ.
                </p>
                <Link to="/shop?category=Tượng" className="btn btn-outline-dark mt-3">Xem Bộ Sưu Tập Tượng</Link>
            </div>
        </div>

        {/* 6. GALLERY PHONG CẢNH NHỎ */}
        <div className="text-center py-5">
            <h2 className="mb-4 fw-bold">Vẻ Đẹp Việt Nam</h2>
            <div className="row g-3">
                <div className="col-md-4">
                    <img 
                        src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                        className="img-fluid rounded shadow-sm" 
                        alt="Hạ Long"
                        // THÊM DÒNG STYLE NÀY:
                        style={{ width: '100%', height: '250px', objectFit: 'cover' }} 
                    />
                </div>
                <div className="col-md-4">
                    <img 
                        src="https://images.unsplash.com/photo-1504457047772-27faf1c00561?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                        className="img-fluid rounded shadow-sm" 
                        alt="Ruộng bậc thang"
                        // THÊM DÒNG STYLE NÀY:
                        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                    />
                </div>
                <div className="col-md-4">
                    <img 
                        src="https://static.tuoitre.vn/tto/i/s626/2015/04/25/41B6gnc8.jpg" 
                        className="img-fluid rounded shadow-sm" 
                        alt="Sài Gòn"
                        // THÊM DÒNG STYLE NÀY:
                        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CulturePage;