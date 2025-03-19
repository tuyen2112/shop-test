import React from 'react';

export default function Shipping() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Chính sách vận chuyển</h1>
      
      <div className="max-w-3xl mx-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Phí vận chuyển</h2>
          <div className="bg-gray-50 p-6 rounded-xl mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Khu vực</th>
                  <th className="text-left py-2">Phí</th>
                  <th className="text-left py-2">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Nội thành Hà Nội</td>
                  <td className="py-2">20.000đ</td>
                  <td className="py-2">1-2 ngày</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Ngoại thành Hà Nội</td>
                  <td className="py-2">30.000đ</td>
                  <td className="py-2">2-3 ngày</td>
                </tr>
                <tr>
                  <td className="py-2">Tỉnh thành khác</td>
                  <td className="py-2">40.000đ</td>
                  <td className="py-2">3-5 ngày</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Miễn phí vận chuyển</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <p className="text-gray-600">
              Miễn phí vận chuyển cho đơn hàng từ 500.000đ
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Phương thức vận chuyển</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold mb-2">Giao hàng tiêu chuẩn</h3>
              <ul className="text-gray-600 space-y-2">
                <li>Thời gian: 2-5 ngày</li>
                <li>Đối tác: Giao hàng nhanh</li>
                <li>Theo dõi đơn hàng</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold mb-2">Giao hàng nhanh</h3>
              <ul className="text-gray-600 space-y-2">
                <li>Thời gian: 1-2 ngày</li>
                <li>Phụ phí: +20.000đ</li>
                <li>Chỉ áp dụng nội thành</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Các section khác */}
      </div>
    </div>
  );
} 