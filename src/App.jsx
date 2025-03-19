import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, User } from 'lucide-react';
import Home from "./components/Home/Home";
import Detail from "./components/Detail/Detail";
import LoginPage from "./components/Login/LoginPage";
import Cart from "./components/Cart/CartProduct";
import TakeCare from "./components/Home/TakeCare";
import AdminProductPage from "./components/Admin/AdminProductPage";
import Checkout from "./components/Checkout/Checkout";
import News from "./components/News/News";
import About from "./components/About/About";
import SizeGuide from "./components/Guide/SizeGuide";
import FAQ from "./components/Guide/FAQ";
import Contact from "./components/Contact/Contact";
import Privacy from "./components/Policy/Privacy";
import Terms from "./components/Policy/Terms";
import Shipping from "./components/Policy/Shipping";
import "./App.css";
import ReturnPolicy from "./components/Policy/ReturnPolicy";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import ProtectedAdminRoute from './components/Admin/ProtectedAdminRoute';
import NewsManager from "./components/News/NewsManager";
import NewsDetail from "./components/News/NewsDetail";
import ProductDetail from './components/Product/ProductDetail';

// import { toast } from 'react-hot-toast';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // toast.success('Đã đăng xuất thành công!');
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-md">
        {/* Top bar */}
        <div className="bg-black text-white py-2">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <a href="tel:1900123456" className="flex items-center hover:text-yellow-400">
                <Phone size={16} className="mr-2" />
                1900 123 456
              </a>
              <a href="mailto:support@mtshop.com" className="flex items-center hover:text-yellow-400">
                <Mail size={16} className="mr-2" />
                support@mtshop.com
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-yellow-400">Tìm cửa hàng</a>
              <a href="#" className="hover:text-yellow-400">Hỗ trợ</a>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">MT<span className="text-yellow-500">Shop</span></span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link to="/" className="nav-link hover:text-yellow-500 transition-colors">
                Trang chủ
              </Link>
              <Link to="/detail" className="nav-link hover:text-yellow-500 transition-colors">
                Sản phẩm
              </Link>
              <Link to="/news" className="nav-link hover:text-yellow-500 transition-colors">
                Tin tức
              </Link>
              <Link to="/take-care" className="nav-link hover:text-yellow-500 transition-colors">
                Chăm sóc
              </Link>
              <Link to="/cart" className="nav-link hover:text-yellow-500 transition-colors">
                Giỏ hàng
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User size={20} className="text-gray-600" />
                    <span className="font-medium">
                      {user.isAdmin ? 'Admin' : user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-black text-white rounded-full hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <span>Đăng xuất</span>
                  </button>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="px-6 py-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors"
                    >
                      Quản lý
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2 bg-black text-white rounded-full hover:bg-yellow-500 transition-colors"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-100">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Về MT Shop</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-yellow-500">Giới thiệu</Link></li>
                <li><Link to="/news" className="hover:text-yellow-500">Tin tức</Link></li>
                <li><Link to="/contact" className="hover:text-yellow-500">Liên hệ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Chính sách</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-yellow-500">Chính sách bảo mật</Link></li>
                <li><Link to="/terms" className="hover:text-yellow-500">Điều khoản sử dụng</Link></li>
                <li><Link to="/shipping" className="hover:text-yellow-500">Chính sách vận chuyển</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Hỗ trợ khách hàng</h3>
              <ul className="space-y-2">
                <li><Link to="/take-care" className="hover:text-yellow-500">Hướng dẫn chăm sóc</Link></li>
                <li><Link to="/size-guide" className="hover:text-yellow-500">Hướng dẫn chọn size</Link></li>
                <li><Link to="/faq" className="hover:text-yellow-500">Câu hỏi thường gặp</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Kết nối với chúng tôi</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-pink-600 hover:text-pink-700">
                  <Instagram size={24} />
                </a>
                <a href="#" className="text-red-600 hover:text-red-700">
                  <Youtube size={24} />
                </a>
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin size={16} />
                  <span>Thường Tín,Hà Nội</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>1900 123 456</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center">
            <p> 2024 <span className="font-bold">MT<span className="text-yellow-500">Shop</span></span>. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail" element={<Detail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/take-care" element={<TakeCare/>}/>
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <AdminProductPage />
                </ProtectedAdminRoute>
              } 
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/new-manager" element={<NewsManager/>}/>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
          <ToastContainer />
        </Layout>
      </AuthProvider>
    </Router>
  );
}
