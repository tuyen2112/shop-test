import React from 'react';

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Chính sách bảo mật</h1>
      
      <div className="max-w-3xl mx-auto prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Thu thập thông tin</h2>
          <p>
            Chúng tôi thu thập các thông tin cần thiết khi bạn:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Đăng ký tài khoản</li>
            <li>Đặt hàng trên website</li>
            <li>Liên hệ với chúng tôi</li>
            <li>Tham gia khảo sát hoặc chương trình khuyến mãi</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Bảo mật thông tin</h2>
          <p>
            Chúng tôi cam kết bảo mật thông tin cá nhân của bạn:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Mã hóa thông tin thanh toán</li>
            <li>Không chia sẻ thông tin cho bên thứ ba</li>
            <li>Bảo vệ dữ liệu theo tiêu chuẩn ngành</li>
          </ul>
        </section>

        {/* Thêm các section khác */}
      </div>
    </div>
  );
} 