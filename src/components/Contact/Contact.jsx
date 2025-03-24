import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form
    console.log(formData);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Liên hệ với chúng tôi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form liên hệ */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Họ và tên</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Số điện thoại</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Chủ đề</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Nội dung</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 h-32"
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>

        {/* Thông tin liên hệ */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <Phone className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="font-bold mb-2">Điện thoại</h3>
              <p className="text-gray-600">1900 123 456</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <Mail className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-gray-600">support@mtshop.com</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <MapPin className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="font-bold mb-2">Địa chỉ</h3>
              <p className="text-gray-600">Thường Tín, Hà Nội</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <Clock className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="font-bold mb-2">Giờ làm việc</h3>
              <p className="text-gray-600">T2 - CN: 9:00 - 21:00</p>
            </div>
          </div>

          {/* Bản đồ */}
          <div className="rounded-xl overflow-hidden h-[300px]">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14912.050300061546!2d105.85227359318887!3d20.871543391613567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135b22e073435a7%3A0xeed8af7828b2da7a!2zdHQuIFRoxrDhu51uZyBUw61uLCBUaMaw4budbmcgVMOtbiwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1742566105530!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy">
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
} 