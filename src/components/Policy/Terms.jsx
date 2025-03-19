import React from 'react';

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Điều khoản sử dụng</h1>
      
      <div className="max-w-3xl mx-auto prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Điều khoản chung</h2>
          <p>
            Khi sử dụng website của MT Shop, bạn đồng ý với các điều khoản sau:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Tuân thủ pháp luật Việt Nam</li>
            <li>Không sử dụng trái phép thông tin</li>
            <li>Không gây hại cho hệ thống</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Quyền sở hữu trí tuệ</h2>
          <p>
            Tất cả nội dung trên website thuộc quyền sở hữu của MT Shop:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Hình ảnh sản phẩm</li>
            <li>Logo và thương hiệu</li>
            <li>Bài viết và nội dung</li>
          </ul>
        </section>

        {/* Thêm các section khác */}
      </div>
    </div>
  );
} 