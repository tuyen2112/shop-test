import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from '../Search/SearchBar';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedGender, setSelectedGender] = useState('nam');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        setError("ID sản phẩm không hợp lệ");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('https://ngochieuwedding.io.vn/api/tuyen/product');
        const { data } = await response.json();
        
        const productData = data.find(p => p._id === id);
        if (productData) {
          setProduct(productData);
          // Lấy 8 sản phẩm cùng category
          const sameCategoryProducts = data.filter(p => 
            p.category === productData.category && p._id !== id
          ).slice(0, 8);
          setRelatedProducts(sameCategoryProducts);
        } else {
          setError("Không tìm thấy sản phẩm");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải thông tin sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(relatedProducts.length / 4));
    }, 3000);
    return () => clearInterval(timer);
  }, [relatedProducts.length]);

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.trim()) {
      try {
        const response = await fetch('https://ngochieuwedding.io.vn/api/tuyen/product');
        const { data } = await response.json();
        const results = data.filter(p => 
          p.name.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowSearchResults(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Vui lòng chọn size và màu sắc!");
      return;
    }

    try {
      const cartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.img,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity
      };

      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      currentCart.push(cartItem);
      localStorage.setItem('cart', JSON.stringify(currentCart));
      
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => navigate('/detail')}
          className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
        >
          Quay lại trang sản phẩm
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Không tìm thấy sản phẩm</p>
        <button
          onClick={() => navigate('/detail')}
          className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
        >
          Quay lại trang sản phẩm
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      
      <SearchBar className="max-w-xl mx-auto mb-8" />

      <button
        onClick={() => navigate('/detail')}
        className="flex items-center text-gray-600 hover:text-black mb-8"
      >
        <ArrowLeft size={20} className="mr-2" />
        Quay lại danh sách sản phẩm
      </button>

      {/* Chi tiết sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div>
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-yellow-600 mb-6">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(product.price)}
          </p>

          {/* Mô tả sản phẩm */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-3 text-black">Mô tả sản phẩm:</h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {(product.mota || product.desc || product.description) ? (
                <div dangerouslySetInnerHTML={{ __html: product.mota || product.desc || product.description }} />
              ) : (
                <p className="italic text-gray-500">Chưa có mô tả cho sản phẩm này</p>
              )}
             
            </div>
          </div>

          {/* Màu sắc */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Màu sắc:</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors?.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-lg transition-all
                    ${selectedColor === color 
                      ? 'bg-black text-white border-black' 
                      : 'hover:border-black'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Kích thước:</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 border rounded-lg flex items-center justify-center transition-all
                    ${selectedSize === size 
                      ? 'bg-black text-white border-black' 
                      : 'hover:border-black'}`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSizeGuide(true)}
              className="mt-2 text-gray-500 hover:text-black"
            >
              Hướng dẫn chọn size
            </button>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Số lượng:</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || !selectedColor}
            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2
              ${(!selectedSize || !selectedColor) 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'} 
              transition-colors`}
          >
            <ShoppingCart className="w-5 h-5" />
            {!selectedSize || !selectedColor 
              ? 'Vui lòng chọn size và màu' 
              : 'Thêm vào giỏ hàng'
            }
          </button>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {relatedProducts.length > 0 && (
        <div className="relative mb-12">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Divide products into chunks of 4 */}
              {Array(Math.ceil(relatedProducts.length / 4)).fill(null).map((_, index) => (
                <div key={index} className="grid grid-cols-4 gap-6 w-full flex-shrink-0">
                  {relatedProducts.slice(index * 4, (index + 1) * 4).map((item) => (
                    <div
                      key={item._id}
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="group cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-lg mb-3">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-[300px] object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-medium mb-2 line-clamp-2">{item.name}</h3>
                      <p className="text-yellow-600">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Navigation buttons */}
            {relatedProducts.length > 4 && (
              <>
                <button
                  onClick={() => setCurrentSlide(prev => (prev - 1 + Math.ceil(relatedProducts.length / 4)) % Math.ceil(relatedProducts.length / 4))}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentSlide(prev => (prev + 1) % Math.ceil(relatedProducts.length / 4))}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Slide indicators */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
              {Array(Math.ceil(relatedProducts.length / 4)).fill(null).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-black w-4' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Size Guide Popup */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6">Hướng dẫn chọn size</h2>
            
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedGender('nam')}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  selectedGender === 'nam' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Nam
              </button>
              <button
                onClick={() => setSelectedGender('nu')}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  selectedGender === 'nu' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Nữ
              </button>
            </div>

            {selectedGender === 'nam' ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2">Size</th>
                      <th className="border p-2">Chiều cao (cm)</th>
                      <th className="border p-2">Cân nặng (kg)</th>
                      <th className="border p-2">Ngực (cm)</th>
                      <th className="border p-2">Eo (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 text-center">S</td>
                      <td className="border p-2 text-center">160-165</td>
                      <td className="border p-2 text-center">50-55</td>
                      <td className="border p-2 text-center">88-92</td>
                      <td className="border p-2 text-center">73-77</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">M</td>
                      <td className="border p-2 text-center">165-170</td>
                      <td className="border p-2 text-center">55-60</td>
                      <td className="border p-2 text-center">92-96</td>
                      <td className="border p-2 text-center">77-81</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">L</td>
                      <td className="border p-2 text-center">170-175</td>
                      <td className="border p-2 text-center">60-65</td>
                      <td className="border p-2 text-center">96-100</td>
                      <td className="border p-2 text-center">81-85</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">XL</td>
                      <td className="border p-2 text-center">175-180</td>
                      <td className="border p-2 text-center">65-70</td>
                      <td className="border p-2 text-center">100-104</td>
                      <td className="border p-2 text-center">85-89</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2">Size</th>
                      <th className="border p-2">Chiều cao (cm)</th>
                      <th className="border p-2">Cân nặng (kg)</th>
                      <th className="border p-2">Ngực (cm)</th>
                      <th className="border p-2">Eo (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 text-center">S</td>
                      <td className="border p-2 text-center">150-155</td>
                      <td className="border p-2 text-center">40-45</td>
                      <td className="border p-2 text-center">82-86</td>
                      <td className="border p-2 text-center">64-68</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">M</td>
                      <td className="border p-2 text-center">155-160</td>
                      <td className="border p-2 text-center">45-50</td>
                      <td className="border p-2 text-center">86-90</td>
                      <td className="border p-2 text-center">68-72</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">L</td>
                      <td className="border p-2 text-center">160-165</td>
                      <td className="border p-2 text-center">50-55</td>
                      <td className="border p-2 text-center">90-94</td>
                      <td className="border p-2 text-center">72-76</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">XL</td>
                      <td className="border p-2 text-center">165-170</td>
                      <td className="border p-2 text-center">55-60</td>
                      <td className="border p-2 text-center">94-98</td>
                      <td className="border p-2 text-center">76-80</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 