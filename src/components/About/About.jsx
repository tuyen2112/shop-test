import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-xl overflow-hidden mb-12">
        <img
          src="/about-hero.jpg"
          alt="MT Shop Store"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Về MT Shop</h1>
            <p className="text-xl text-gray-200">Thời trang cho mọi phong cách sống</p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6">Câu chuyện của chúng tôi</h2>
        <p className="text-gray-600 mb-4">
          MT Shop được thành lập vào năm 2020 với sứ mệnh mang đến những sản phẩm thời trang chất lượng cao 
          với giá cả hợp lý cho người tiêu dùng Việt Nam.
        </p>
        <p className="text-gray-600 mb-4">
          Chúng tôi tin rằng thời trang không chỉ là về quần áo, mà còn là cách bạn thể hiện cá tính 
          và phong cách sống của mình.
        </p>
      </div>

      {/* Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Chất lượng</h3>
          <p className="text-gray-600">Cam kết mang đến những sản phẩm chất lượng cao nhất</p>
        </div>
        {/* Thêm các giá trị khác tương tự */}
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Liên hệ với chúng tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start space-x-4">
            <MapPin className="w-6 h-6 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-2">Địa chỉ</h3>
              <p className="text-gray-600">123 Đường ABC, Quận XYZ, TP.HCM</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Phone className="w-6 h-6 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-2">Điện thoại</h3>
              <p className="text-gray-600">1900 123 456</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Mail className="w-6 h-6 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-gray-600">support@mtshop.com</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-2">Giờ làm việc</h3>
              <p className="text-gray-600">T2 - CN: 9:00 - 21:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 