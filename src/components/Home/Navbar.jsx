import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import Log from "./Log";


export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLog, setShowLog] = useState(false);

  return (
    <header>
      <div className="bg-red-600 text-white text-sm flex justify-between px-4 py-2">
        <span>🛍️ Dọn kho sale đậm 50-70%</span>
        <div>
          <span className="mr-4">📞 Hotline: <strong>18008118</strong></span>
          <span>🏬 Shop: <strong>Hệ thống cửa hàng</strong></span>
        </div>
      </div>

      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-red-600 text-2xl font-bold flex items-center">
          <img src="https://res.cloudinary.com/dv8e9h3o7/image/upload/v1741347703/DALL_E_2025-03-07_12.38.38_-_A_circular_shop_icon_with_a_black_background._The_icon_features_the_bold_stylish_letters_MT_in_the_center_designed_with_a_modern_and_sleek_font._S_yd2he8.webp" alt="5S Fashion" className="h-8 mr-2" />
          5S <span className="text-black">FASHION</span>
        </Link>

        <ul className="hidden md:flex space-x-6 font-semibold">
          <li><Link to="/sale" className="hover:text-red-500">SALE 70%</Link></li>
          <li><Link to="/ao-nam" className="hover:text-red-500">ÁO NAM</Link></li>
          <li><Link to="/quan-nam" className="hover:text-red-500">QUẦN NAM</Link></li>
          <li><Link to="/do-bo-nam" className="hover:text-red-500">ĐỒ BỘ NAM</Link></li>
          <li><Link to="/phu-kien" className="hover:text-red-500">PHỤ KIỆN</Link></li>
          <li><Link to="/bo-suu-tap" className="hover:text-red-500">BỘ SƯU TẬP</Link></li>
          <li><Link to="/ve-chung-toi" className="hover:text-red-500">VỀ CHÚNG TÔI</Link></li>
        </ul>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="border px-4 py-2 rounded-lg pl-10"
            />
            <Search className="absolute left-3 top-2 text-gray-500 w-5 h-5" />
          </div>

          {/* Nút đăng nhập / đăng xuất */}
          {isLoggedIn ? (
            <button onClick={() => setIsLoggedIn(false)} className="text-red-600 font-semibold">
              Đăng xuất
            </button>
          ) : (
            <button onClick={() => setShowLog(true)} className="relative">
              <User className="w-6 h-6" />
            </button>
          )}

          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
          </Link>
        </div>
      </nav>

      {showLog && <Log onLogin={() => { setIsLoggedIn(true); setShowLog(false); }} />}
    </header>
  );
}
