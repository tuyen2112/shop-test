import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Search, Ruler, ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductDetail() {
  // Lấy id từ params URL
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState(null);

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
          // Lọc sản phẩm cùng category
          const sameCategoryProducts = data.filter(p => 
            p.category === productData.category && p._id !== id
          );
          setCategoryProducts(sameCategoryProducts.slice(0, 8));
          setRelatedProducts(sameCategoryProducts.slice(0, 4));
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
  }, [id]); // Thêm id vào dependencies

  // Tự động chạy slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(categoryProducts.length / 4));
    }, 3000);
    return () => clearInterval(timer);
  }, [categoryProducts.length]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
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

  // Component hướng dẫn chọn size
  const SizeGuidePopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Hướng dẫn chọn size</h3>
          <button 
            onClick={() => setShowSizeGuide(false)}
            className="text-gray-500 hover:text-black"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-3 text-left">Size</th>
                  <th className="border p-3 text-left">Chiều cao (cm)</th>
                  <th className="border p-3 text-left">Cân nặng (kg)</th>
                  <th className="border p-3 text-left">Ngực (cm)</th>
                  <th className="border p-3 text-left">Eo (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">S</td>
                  <td className="border p-3">150-160</td>
                  <td className="border p-3">45-50</td>
                  <td className="border p-3">80-84</td>
                  <td className="border p-3">60-64</td>
                </tr>
                <tr>
                  <td className="border p-3">M</td>
                  <td className="border p-3">155-165</td>
                  <td className="border p-3">50-55</td>
                  <td className="border p-3">84-88</td>
                  <td className="border p-3">64-68</td>
                </tr>
                <tr>
                  <td className="border p-3">L</td>
                  <td className="border p-3">160-170</td>
                  <td className="border p-3">55-60</td>
                  <td className="border p-3">88-92</td>
                  <td className="border p-3">68-72</td>
                </tr>
                <tr>
                  <td className="border p-3">XL</td>
                  <td className="border p-3">165-175</td>
                  <td className="border p-3">60-65</td>
                  <td className="border p-3">92-96</td>
                  <td className="border p-3">72-76</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Cách đo:</h4>
            <p>1. Ngực: Đo vòng ngực tại điểm rộng nhất</p>
            <p>2. Eo: Đo vòng eo tại điểm nhỏ nhất</p>
            <p>3. Chiều cao: Đo từ đỉnh đầu đến gót chân</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/detail')}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Quay lại trang sản phẩm
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">Không tìm thấy sản phẩm</p>
          <button
            onClick={() => navigate('/detail')}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Quay lại trang sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... existing search bar and navigation ... */}

      {/* Chi tiết sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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

          

          {/* Size */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Kích thước:</h3>
              <button 
                onClick={() => setShowSizeGuide(true)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Ruler className="w-4 h-4" />
                Hướng dẫn chọn size
              </button>
            </div>
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

          {/* ... existing description ... */}

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
              : `Thêm ${quantity} vào giỏ hàng`
            }
          </button>
        </div>
      </div>

      {/* Slider sản phẩm cùng danh mục */}
      {categoryProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm cùng danh mục</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {categoryProducts.map((item) => (
                  <div
                    key={item._id}
                    className="w-1/4 flex-shrink-0 px-2"
                  >
                    <div 
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
                      <h3 className="font-medium mb-2">{item.name}</h3>
                      <p className="text-yellow-600">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setCurrentSlide((prev) => 
                prev === 0 ? Math.ceil(categoryProducts.length / 4) - 1 : prev - 1
              )}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => 
                (prev + 1) % Math.ceil(categoryProducts.length / 4)
              )}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ... existing related products section ... */}

      {showSizeGuide && <SizeGuidePopup />}
    </div>
  );
} 