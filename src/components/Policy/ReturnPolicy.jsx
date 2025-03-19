import React from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Package, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ReturnPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-yellow-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại
        </button>

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Chính sách đổi trả
        </h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
          Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng với chính sách đổi trả linh hoạt
        </p>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-4">Điều kiện đổi trả</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                Sản phẩm còn nguyên tem mác
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                Chưa qua sử dụng hoặc giặt ủi
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                Còn đầy đủ hóa đơn mua hàng
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-4">Trường hợp không áp dụng</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                Sản phẩm đã qua sử dụng
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                Không còn nguyên tem mác
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                Quá thời hạn 7 ngày
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Package className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-4">Quy trình đổi trả</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                Liên hệ hotline 1800 1234
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                Cung cấp mã đơn hàng
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                Nhận mã đổi trả
              </li>
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Quy trình đổi trả chi tiết</h2>
          <div className="space-y-8">
            {[
              {
                step: 1,
                title: "Liên hệ với chúng tôi",
                description: "Gọi hotline 1800 1234 hoặc gửi email để được hướng dẫn"
              },
              {
                step: 2,
                title: "Đóng gói sản phẩm",
                description: "Đóng gói cẩn thận với đầy đủ phụ kiện và hóa đơn"
              },
              {
                step: 3,
                title: "Gửi hàng",
                description: "Gửi hàng theo hướng dẫn của nhân viên CSKH"
              },
              {
                step: 4,
                title: "Hoàn tất",
                description: "Nhận sản phẩm mới hoặc hoàn tiền trong vòng 24h"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold shrink-0">
                  {item.step}
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Box */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ thêm?</h2>
          <p className="mb-6">Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
              Gọi 1800 1234
            </button>
            <button className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
              Gửi email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 