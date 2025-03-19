import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react';

export default function FAQ() {
  const [openItem, setOpenItem] = useState(null);

  const faqs = [
    {
      question: "Làm thế nào để đặt hàng?",
      answer: "Bạn có thể đặt hàng trực tiếp trên website bằng cách chọn sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán. Hoặc bạn có thể liên hệ với chúng tôi qua hotline 1900 123 456."
    },
    {
      question: "Thời gian giao hàng là bao lâu?",
      answer: "Thời gian giao hàng thường từ 2-5 ngày làm việc tùy thuộc vào khu vực. Với đơn hàng nội thành, thời gian giao hàng có thể nhanh hơn."
    },
    {
      question: "Chính sách đổi trả như thế nào?",
      answer: "Chúng tôi chấp nhận đổi trả trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên tem mác và chưa qua sử dụng."
    },
    // Thêm các câu hỏi khác
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Câu hỏi thường gặp</h1>

      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-xl overflow-hidden">
              <button
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
                onClick={() => setOpenItem(openItem === index ? null : index)}
              >
                <span className="font-medium text-left">{faq.question}</span>
                {openItem === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openItem === index && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Vẫn chưa tìm thấy câu trả lời?</h2>
        <p className="text-gray-600 mb-8">
          Liên hệ với chúng tôi qua các kênh sau
        </p>
        <div className="flex justify-center space-x-8">
          <a
            href="tel:1900123456"
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Phone className="w-5 h-5 mr-2" />
            1900 123 456
          </a>
          <a
            href="mailto:support@mtshop.com"
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Mail className="w-5 h-5 mr-2" />
            support@mtshop.com
          </a>
        </div>
      </div>
    </div>
  );
} 