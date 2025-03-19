import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Search } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductDetail() {
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

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch('https://ngochieuwedding.io.vn/api/tuyen/product');
        const { data } = await response.json();
        
        const productData = data.find(p => p._id === id);
        if (productData) {
          console.log('Product Data:', JSON.stringify(productData, null, 2)); 
          console.log('Available fields:', Object.keys(productData)); 
          console.log('Description:', productData.desc); 
          setProduct(productData);
          // Lọc sản phẩm liên quan (cùng category)
          const related = data.filter(p => 
            p.category === productData.category && p._id !== id
          ).slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

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
        // description: product.description,
        size: selectedSize,
        color: selectedColor
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
      
      {/* Thanh tìm kiếm */}
      <div className="max-w-xl mx-auto mb-8 relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-12 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Kết quả tìm kiếm */}
        {showSearchResults && (
          <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border z-50 max-h-[60vh] overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map(item => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/product/${item._id}`);
                    setShowSearchResults(false);
                    setSearchTerm('');
                  }}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-yellow-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(item.price)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500">
                Không tìm thấy sản phẩm phù hợp
              </div>
            )}
          </div>
        )}
      </div>

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
              <div className="mt-2 text-xs text-gray-400">
                ID sản phẩm: {product._id}
              </div>
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
        <div>
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
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
                <h3 className="font-medium mb-2">{item.name}</h3>
                <p className="text-yellow-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(item.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 