import React from 'react';

export default function SizeGuide() {
  const sizeCharts = {
    men: [
      { size: 'S', chest: '88-92', waist: '73-77', hip: '88-92' },
      { size: 'M', chest: '96-100', waist: '78-82', hip: '96-100' },
      { size: 'L', chest: '104-108', waist: '83-87', hip: '104-108' },
      { size: 'XL', chest: '112-116', waist: '88-92', hip: '112-116' }
    ],
    women: [
      { size: 'S', chest: '82-86', waist: '64-68', hip: '88-92' },
      { size: 'M', chest: '86-90', waist: '68-72', hip: '92-96' },
      { size: 'L', chest: '90-94', waist: '72-76', hip: '96-100' },
      { size: 'XL', chest: '94-98', waist: '76-80', hip: '100-104' }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Hướng dẫn chọn size</h1>

      {/* Cách đo */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Cách đo size chuẩn</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-bold mb-4">Vòng ngực</h3>
            <p className="text-gray-600">Đo vòng quanh phần đầy đặn nhất của ngực</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-bold mb-4">Vòng eo</h3>
            <p className="text-gray-600">Đo vòng quanh phần nhỏ nhất của eo</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-bold mb-4">Vòng hông</h3>
            <p className="text-gray-600">Đo vòng quanh phần đầy đặn nhất của hông</p>
          </div>
        </div>
      </div>

      {/* Bảng size nam */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Bảng size nam</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Size</th>
                <th className="px-6 py-3 text-left">Ngực (cm)</th>
                <th className="px-6 py-3 text-left">Eo (cm)</th>
                <th className="px-6 py-3 text-left">Hông (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sizeCharts.men.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{item.size}</td>
                  <td className="px-6 py-4">{item.chest}</td>
                  <td className="px-6 py-4">{item.waist}</td>
                  <td className="px-6 py-4">{item.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bảng size nữ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Bảng size nữ</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Size</th>
                <th className="px-6 py-3 text-left">Ngực (cm)</th>
                <th className="px-6 py-3 text-left">Eo (cm)</th>
                <th className="px-6 py-3 text-left">Hông (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sizeCharts.women.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{item.size}</td>
                  <td className="px-6 py-4">{item.chest}</td>
                  <td className="px-6 py-4">{item.waist}</td>
                  <td className="px-6 py-4">{item.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lưu ý */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
        <h3 className="font-bold mb-2">Lưu ý:</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Các số đo trong bảng là số đo cơ thể, không phải số đo quần áo</li>
          <li>Nếu số đo của bạn nằm giữa hai size, hãy chọn size lớn hơn</li>
          <li>Các số đo có thể chênh lệch 1-2cm tùy từng mẫu</li>
        </ul>
      </div>
    </div>
  );
} 