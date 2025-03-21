import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center px-6 py-10 bg-white shadow-xl rounded-lg">
        <h1 className="text-9xl font-extrabold text-gray-300">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4">Oops! Trang không tồn tại</h2>
        <p className="text-gray-600 mt-2 mb-6">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
