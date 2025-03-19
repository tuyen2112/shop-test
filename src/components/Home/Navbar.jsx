import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, ShoppingCart } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Navbar() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

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

  const categories = [
    {
      name: "Nam",
      keywords: ["NAM", "THỜI TRANG NAM", "QUẦN ÁO NAM", "ĐỒ NAM", "FASHION MEN", "MEN"]
    },
    {
      name: "Nữ",
      keywords: ["NỮ", "THỜI TRANG NỮ", "QUẦN ÁO NỮ", "ĐỒ NỮ", "FASHION WOMEN", "WOMEN"]
    },
    {
      name: "Trẻ em",
      keywords: ["TRẺ EM", "THỜI TRANG TRẺ EM", "QUẦN ÁO TRẺ EM", "ĐỒ TRẺ EM", "KIDS", "CHILDREN"]
    }
  ];

  useEffect(() => {
    fetch('https://ngochieuwedding.io.vn/api/tuyen/product')
      .then(response => response.json())
      .then(data => {
        setProducts(data.data.slice(0, 5));
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      setIsSearching(true);
      setShowSuggestions(true);
      try {
        const response = await fetch('https://ngochieuwedding.io.vn/api/tuyen/product');
        const { data } = await response.json();
        
        // Tìm kiếm sản phẩm
        const searchValue = value.toUpperCase();
        const results = data.filter(product => {
          const nameMatch = product.name.toUpperCase().includes(searchValue);
          const categoryMatch = product.category.toUpperCase().includes(searchValue);
          const descriptionMatch = product.description?.toUpperCase().includes(searchValue);
          return nameMatch || categoryMatch || descriptionMatch;
        });

        // Nhóm kết quả theo danh mục
        const groupedResults = {};
        results.forEach(product => {
          if (!groupedResults[product.category]) {
            groupedResults[product.category] = [];
          }
          groupedResults[product.category].push(product);
        });

        setSearchResults(groupedResults);
      } catch (error) {
        console.error('Error searching:', error);
        toast.error('Có lỗi xảy ra khi tìm kiếm');
      } finally {
        setIsSearching(false);
      }
    } else {
      setShowSuggestions(false);
      setSearchResults({});
    }
  };

  // Thêm hàm highlight text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) => 
          part.toUpperCase() === searchTerm.toUpperCase() ? (
            <span key={index} className="bg-yellow-200">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const handleSelectCategory = (category) => {
    navigate(`/detail?category=${category}`);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const filteredCategories = categories.filter(category => {
    const searchValue = searchTerm.toUpperCase();
    return category.keywords.some(keyword => keyword.includes(searchValue)) ||
           category.name.toUpperCase().includes(searchValue);
  });

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
                {/* Ảnh sản phẩm */}
                <div className="w-full md:w-1/2">
                  <img 
                    src={product.img} 
                    alt={product.name}
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                </div>

                {/* Thông tin sản phẩm */}
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
    <header className="bg-white">
      <ToastContainer />
      {/* Navbar đơn giản hóa */}
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="https://res.cloudinary.com/dv8e9h3o7/image/upload/v1741347703/DALL_E_2025-03-07_12.38.38_-_A_circular_shop_icon_with_a_black_background._The_icon_features_the_bold_stylish_letters_MT_in_the_center_designed_with_a_modern_and_sleek_font._S_yd2he8.webp" 
              alt="MT Fashion" 
              className="h-10 w-auto"
            />
          </Link>

          <div className="relative w-full max-w-xl mx-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-12 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border z-50 max-h-[80vh] overflow-y-auto">
                {isSearching ? (
                  <div className="px-4 py-3 text-gray-500 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                    Đang tìm kiếm...
                  </div>
                ) : Object.keys(searchResults).length > 0 ? (
                  <div>
                    {Object.entries(searchResults).map(([category, products]) => (
                      <div key={category} className="border-b last:border-b-0">
                        <div className="px-4 py-2 bg-gray-50 font-medium">
                          Danh mục: {category}
                        </div>
                        {products.slice(0, 3).map(product => (
                          <div
                            key={product._id}
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowSuggestions(false);
                            }}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                          >
                            <img 
                              src={product.img} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">
                                {highlightText(product.name, searchTerm)}
                              </p>
                              <p className="text-sm text-yellow-600">
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(product.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {products.length > 3 && (
                          <div 
                            className="px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              navigate(`/detail?category=${category}`);
                              setShowSuggestions(false);
                              setSearchTerm('');
                            }}
                          >
                            Xem thêm {products.length - 3} sản phẩm trong {category}...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : searchTerm.trim() ? (
                  <div className="px-4 py-3 text-gray-500">
                    Không tìm thấy sản phẩm phù hợp
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Slider sản phẩm */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="w-full h-[400px] bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={3}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={true}
              className="!pb-12"
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
            >
              {products.map((product) => (
                <SwiperSlide key={product._id}>
                  <div 
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer"
                  >
                    <div className="relative group h-[400px] bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                      <img 
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white text-lg font-medium truncate">
                            {product.name}
                          </h3>
                          <p className="text-yellow-400 font-semibold mt-1">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(product.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

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
    </header>
  );
}
