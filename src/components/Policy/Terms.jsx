import React from 'react';
import { Scale, Copyright, FileText, AlertCircle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Điều khoản sử dụng</h1>
            <p className="text-xl text-gray-300">
              Quy định và điều khoản khi sử dụng website MT Shop
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
                  <FileText className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold">1. Điều khoản chung</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Khi sử dụng website của MT Shop, bạn đồng ý với các điều khoản sau:
              </p>
              <ul className="space-y-4">
                {[
                  'Tuân thủ pháp luật Việt Nam',
                  'Không sử dụng trái phép thông tin',
                  'Không gây hại cho hệ thống',
                  'Không vi phạm quyền sở hữu trí tuệ'
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
                  <Copyright className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold">2. Quyền sở hữu trí tuệ</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Tất cả nội dung trên website thuộc quyền sở hữu của MT Shop:
              </p>
              <ul className="space-y-4">
                {[
                  'Hình ảnh sản phẩm',
                  'Logo và thương hiệu',
                  'Bài viết và nội dung',
                  'Thiết kế và giao diện'
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
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold">3. Giới hạn trách nhiệm</h2>
              </div>
              <p className="text-gray-600 mb-6">
                MT Shop không chịu trách nhiệm về:
              </p>
              <ul className="space-y-4">
                {[
                  'Thông tin không chính xác từ người dùng',
                  'Lỗi kỹ thuật ngoài tầm kiểm soát',
                  'Thiệt hại gián tiếp phát sinh',
                  'Vi phạm từ bên thứ ba'
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-8">
              <p className="text-gray-700 text-sm">
                Bằng cách sử dụng website của chúng tôi, bạn đồng ý với các điều khoản và điều kiện này. 
                Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng không sử dụng website của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 