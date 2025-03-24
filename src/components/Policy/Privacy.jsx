import React from 'react';
import { Shield, Lock, Database, UserCheck } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Chính sách bảo mật</h1>
            <p className="text-xl text-gray-300">
              Cam kết bảo vệ thông tin và quyền riêng tư của khách hàng
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                  <Database className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold">1. Thu thập thông tin</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Chúng tôi thu thập các thông tin cần thiết khi bạn:
              </p>
              <ul className="space-y-4">
                {[
                  'Đăng ký tài khoản',
                  'Đặt hàng trên website',
                  'Liên hệ với chúng tôi',
                  'Tham gia khảo sát hoặc chương trình khuyến mãi'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    </span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                  <Lock className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold">2. Bảo mật thông tin</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Chúng tôi cam kết bảo mật thông tin cá nhân của bạn:
              </p>
              <ul className="space-y-4">
                {[
                  'Mã hóa thông tin thanh toán',
                  'Không chia sẻ thông tin cho bên thứ ba',
                  'Bảo vệ dữ liệu theo tiêu chuẩn ngành'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    </span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                  <UserCheck className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold">3. Quyền của người dùng</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Bạn có quyền:
              </p>
              <ul className="space-y-4">
                {[
                  'Truy cập và chỉnh sửa thông tin cá nhân',
                  'Yêu cầu xóa tài khoản',
                  'Từ chối nhận thông tin marketing',
                  'Khiếu nại về việc xử lý dữ liệu'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    </span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 