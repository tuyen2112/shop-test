import React from "react";
import { Phone, Mail, Truck, RefreshCcw, Ruler, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TakeCare() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section với video background */}
      <div className="relative h-[600px] overflow-hidden">
        <img
          src="https://source.unsplash.com/1600x900/?fashion,luxury"
          alt="Customer Care Banner"
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70">
          <div className="container mx-auto h-full flex flex-col items-center justify-center text-white text-center px-4">
            <span className="text-yellow-400 uppercase tracking-wider mb-4 animate-fade-in">MT Fashion Care</span>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
              Chăm Sóc Khách Hàng <br/> 
              <span className="text-yellow-400">Tận Tâm</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-8 animate-fade-in-up delay-200">
              Đồng hành cùng bạn trong mọi trải nghiệm mua sắm
            </p>
            <div className="flex gap-4 animate-fade-in-up delay-300">
              <button className="px-8 py-4 bg-yellow-400 text-black rounded-full font-medium hover:bg-yellow-300 transition-all duration-300 flex items-center group">
                Liên hệ ngay
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Cards với animation khi scroll */}
      <div className="container mx-auto py-24 px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-8">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Tổng đài hỗ trợ 24/7</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Đội ngũ tư vấn viên chuyên nghiệp luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi
            </p>
            <p className="text-2xl font-bold text-yellow-500">1800 1234</p>
            <p className="text-gray-500">(Miễn phí cuộc gọi)</p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-8">
              <Ruler className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Hướng dẫn chọn size</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tư vấn kỹ lưỡng để bạn chọn được size phù hợp nhất với dáng người
            </p>
            <button className="text-yellow-500 font-medium flex items-center group">
              Xem hướng dẫn chi tiết
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div 
            onClick={() => navigate('/return-policy')}
            className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-8">
              <RefreshCcw className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Chính sách đổi trả</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Đổi trả dễ dàng trong 7 ngày với mọi sản phẩm. Hoàn tiền nhanh chóng
            </p>
            <button className="text-yellow-500 font-medium flex items-center group">
              Tìm hiểu thêm
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {/* FAQ Section với animation */}
        <div className="max-w-4xl mx-auto mb-24">
          <h2 className="text-4xl font-bold text-center mb-16">
            Câu hỏi <span className="text-yellow-500">thường gặp</span>
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "Làm thế nào để theo dõi đơn hàng?",
                answer: "Bạn có thể theo dõi đơn hàng bằng mã đơn hàng được gửi qua email hoặc tin nhắn SMS."
              },
              {
                question: "Thời gian giao hàng là bao lâu?",
                answer: "Thời gian giao hàng từ 2-5 ngày làm việc tùy khu vực. Riêng khu vực nội thành có thể nhận hàng trong 24h."
              },
              {
                question: "Có thể đổi size sau khi mua không?",
                answer: "Bạn có thể đổi size trong vòng 7 ngày kể từ ngày nhận hàng, sản phẩm chưa qua sử dụng và còn nguyên tem mác."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold mb-4">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        
      </div>
    </div>
  );
}

