import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div>
      {/* 1. HERO BANNER */}
      <div 
        className="position-relative text-center text-white d-flex align-items-center justify-content-center"
        style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
            height: '400px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
            backgroundBlendMode: 'darken'
        }}
      >
        <div className="container">
            <h1 className="display-3 fw-bold mb-3">Câu Chuyện Của Art Craft</h1>
            <p className="lead px-md-5 mx-md-5">
                Nơi hội tụ tinh hoa nghệ thuật truyền thống và đương đại Việt Nam.
            </p>
        </div>
      </div>

      <div className="container py-5">
        
        {/* 2. GIỚI THIỆU CHUNG */}
        <div className="row align-items-center mb-5">
            <div className="col-md-6 mb-4 mb-md-0">
                <img 
                    src="https://edinburghartshop.co.uk/wp-content/uploads/2017/04/Edinburgh-Art-Shop-Header.jpg" 
                    alt="Art Workshop" 
                    className="img-fluid rounded shadow-lg"
                />
            </div>
            <div className="col-md-6 ps-md-5">
                <h2 className="fw-bold mb-3" style={{color: '#e65100'}}>Sứ Mệnh Của Chúng Tôi</h2>
                <p className="text-muted" style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
                    Art Craft được thành lập với niềm đam mê cháy bỏng dành cho nghệ thuật thủ công Việt Nam. 
                    Chúng tôi mong muốn trở thành cầu nối vững chắc giữa những nghệ nhân tài hoa tại các làng nghề truyền thống 
                    (như Bát Tràng, Đông Hồ, Sơn Mài Hạ Thái...) với những người yêu cái đẹp trên khắp cả nước và quốc tế.
                </p>
                <p className="text-muted" style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
                    Mỗi tác phẩm tại Art Craft không chỉ là một món đồ trang trí, mà là một câu chuyện văn hóa, 
                    một nét đẹp tâm linh và là sự kết tinh của hàng ngàn giờ lao động tỉ mỉ.
                </p>
            </div>
        </div>

        {/* 3. GIÁ TRỊ CỐT LÕI (3 Cột) */}
        <div className="row text-center mb-5 mt-5">
            <div className="col-md-4 mb-4">
                <div className="p-4 border rounded shadow-sm h-100 bg-white">
                    <div className="mb-3 text-warning" style={{fontSize: '3rem'}}><i className="bi bi-gem"></i></div>
                    <h4 className="fw-bold">Chất Lượng Đỉnh Cao</h4>
                    <p className="text-muted">Cam kết 100% sản phẩm được chế tác thủ công, kiểm định nghiêm ngặt trước khi đến tay khách hàng.</p>
                </div>
            </div>
            <div className="col-md-4 mb-4">
                <div className="p-4 border rounded shadow-sm h-100 bg-white">
                    <div className="mb-3 text-warning" style={{fontSize: '3rem'}}><i className="bi bi-heart"></i></div>
                    <h4 className="fw-bold">Tôn Vinh Giá Trị</h4>
                    <p className="text-muted">Gìn giữ và phát triển các giá trị văn hóa truyền thống, hỗ trợ đời sống cho các nghệ nhân làng nghề.</p>
                </div>
            </div>
            <div className="col-md-4 mb-4">
                <div className="p-4 border rounded shadow-sm h-100 bg-white">
                    <div className="mb-3 text-warning" style={{fontSize: '3rem'}}><i className="bi bi-truck"></i></div>
                    <h4 className="fw-bold">Dịch Vụ Tận Tâm</h4>
                    <p className="text-muted">Vận chuyển chuyên nghiệp (Art Handling), đóng gói an toàn và hỗ trợ đổi trả minh bạch.</p>
                </div>
            </div>
        </div>

        {/* 4. CALL TO ACTION */}
        <div className="text-center py-5 rounded mb-5" style={{backgroundColor: '#fffcf5', border: '2px dashed #e65100'}}>
            <h3 className="fw-bold mb-3">Bạn Đã Sẵn Sàng Khám Phá?</h3>
            <p className="mb-4 text-muted">Hãy để chúng tôi mang nghệ thuật đến không gian sống của bạn.</p>
            <Link to="/shop" className="btn btn-dark btn-lg px-5 shadow" style={{backgroundColor: '#e65100', border: 'none'}}>
                Xem Bộ Sưu Tập Ngay
            </Link>
        </div>

      </div>

      {/* 5. FOOTER NOTE (DÒNG CHỮ THEO YÊU CẦU) */}
      <div className="py-4 text-center border-top bg-light mt-auto">
          <div className="container">
              <p className="mb-0 text-muted fst-italic small" style={{fontSize: '0.9rem'}}>
                  Đây là đồ án của nhóm sinh viên lớp 11_ĐHCNPM1 trường HCMUNRE nên có sai sót mong mọi người bỏ qua
              </p>
          </div>
      </div>

    </div>
  );
};

export default AboutPage;