import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./Navbar";


export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const navigate = useNavigate();
  const [categoryImages, setCategoryImages] = useState({
    'Nam': '',
    'Nữ': '',
    'Trẻ em': ''
  });

  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        const response = await fetch('https://ngochieuwedding.io.vn/api/tuyen/product');
        const data = await response.json();
        
        // Tạo object để lưu trữ ảnh
        const images = {
          'Nam': '',
          'Nữ': '',
          'Trẻ em': ''
        };

        // Log để kiểm tra category từ API
        console.log('Categories from API:', data.data.map(product => product.category));

        // Lặp qua tất cả sản phẩm để tìm ảnh đầu tiên cho mỗi category
        data.data.forEach(product => {
          const category = product.category.trim(); // Loại bỏ khoảng trắng thừa nếu có
          if (!images[category] && product.img) {
            images[category] = product.img;
          }
        });
        
        setCategoryImages(images);
        
        // Log để kiểm tra images đã lấy được
        console.log('Fetched category images:', images);
      } catch (error) {
        console.error('Error fetching category images:', error);
      }
    };

    fetchCategoryImages();
  }, []);

  const categories = [
    {
      id: 1,
      name: "Nam",
      description: "Thời trang nam lịch lãm, phong cách",
    },
    {
      id: 2, 
      name: "Nữ",
      description: "Thời trang nữ hiện đại, thanh lịch",
    },
    {
      id: 3,
      name: "Trẻ em",
      description: "Thời trang trẻ em năng động, thoải mái",
    }
  ];

  // Thông báo
  const notifySuccess = () => toast.success('Đã thêm vào giỏ hàng!', {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  const notifyError = () => toast.error('Vui lòng chọn size và màu sắc!', {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  // Popup component
  const ProductPopup = ({ product, onClose }) => {
    const handleAddToCart = () => {
      if (!selectedSize || !selectedColor) {
        notifyError();
        return;
      }

      const cartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.img,
        size: selectedSize,
        color: selectedColor,
        quantity: 1
      };

      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      currentCart.push(cartItem);
      localStorage.setItem('cart', JSON.stringify(currentCart));
      
      notifySuccess();
      onClose();
    };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <img 
                    src={product.img} 
                    alt={product.name}
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">{product.name}</h3>
                  <p className="text-xl font-semibold text-yellow-600 mb-4">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(product.price)}
                  </p>

                  {/* Màu sắc */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Màu sắc:</h4>
                    <div className="flex gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1 border rounded-full text-sm transition-all
                            ${selectedColor === color 
                              ? 'bg-black text-white' 
                              : 'hover:bg-gray-100'}`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Kích thước:</h4>
                    <div className="flex gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-10 flex items-center justify-center border rounded-full text-sm transition-all
                            ${selectedSize === size 
                              ? 'bg-black text-white' 
                              : 'hover:bg-gray-100'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mô tả */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Mô tả:</h4>
                    <p className="text-gray-600">{product.description}</p>
      </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay opacity-50"></div>
        <div className="relative container h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              MT Fashion
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed">
              Khám phá phong cách thời trang độc đáo và đẳng cấp cùng MT Fashion
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/detail')}
                className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors inline-flex items-center group"
              >
                Mua sắm ngay
                <svg 
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <Link 
                to="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-black transition-colors"
              >
                Về chúng tôi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Danh Mục Sản Phẩm</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Khám phá các bộ sưu tập đa dạng của chúng tôi, từ thời trang nam, nữ đến trẻ em
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div 
                key={category.id}
                onClick={() => navigate(`/detail?category=${category.name}`)}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden relative">
                  {categoryImages[category.name] ? (
                    <img 
                      src={categoryImages[category.name]}
                      alt={category.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full animate-pulse bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">Đang tải...</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                      <p className="text-gray-200">{category.description}</p>
                      <span className="text-white font-medium inline-flex items-center mt-4 group-hover:translate-x-2 transition-transform">
                        Xem thêm
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popup */}
      {selectedProduct && (
        <ProductPopup 
          product={selectedProduct} 
          onClose={() => {
            setSelectedProduct(null);
            setSelectedSize(null);
            setSelectedColor(null);
          }} 
        />
      )}

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4m16 0l-8 4m8 4l-8 4m8-4l-8 4m8-4v-4m-16 4l8-4m-8 4l8 4m-8-4v-4m8 4v-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Miễn phí vận chuyển</h3>
              <p className="text-gray-600">Cho đơn hàng từ 500K</p>
            </div>
            {/* Thêm các features khác tương tự */}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-black text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Đăng ký nhận thông tin</h2>
            <p className="text-gray-400 mb-8">
              Nhận thông tin về các bộ sưu tập mới và ưu đãi đặc biệt
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </section>

      
    </div>
  );
}
