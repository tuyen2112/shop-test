import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tab } from '@headlessui/react';
import { ShoppingCart, X, Search, Eye } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from '../Search/SearchBar';

export default function Detail() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || "Nam";
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [showSuggestions, setShowSuggestions] = useState(false);
  // const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
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
  const [selectedTab, setSelectedTab] = useState(
    categories.findIndex(c => c.name === initialCategory)
  );
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const subCategories = {
    Nam: ['Áo thun nam', 'Áo khoác nam', 'Quần jean nam', 'Quần tây nam'],
    Nữ: ['Áo thun nữ', 'Áo khoác nữ', 'Váy', 'Quần jean nữ'],
    'Trẻ em': ['Áo thun trẻ em', 'Áo khoác trẻ em', 'Quần trẻ em', 'Váy trẻ em']
  };

  const priceRanges = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Dưới 200K', value: '0-200000' },
    { label: '200K - 500K', value: '200000-500000' },
    { label: '500K - 1M', value: '500000-1000000' },
    { label: 'Trên 1M', value: '1000000-999999999' }
  ];

  const sortOptions = [
    { label: 'Mặc định', value: 'default' },
    { label: 'Giá từ cao đến thấp', value: 'price-desc' },
    { label: 'Giá từ thấp đến cao', value: 'price-asc' },
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' }
  ];

  const filterBySubCategory = (products, category, subCategory) => {
    return products.filter(product => 
      product.category === category && 
      product.name.toLowerCase().includes(subCategory.toLowerCase())
    );
  };

  const filterByPrice = (products) => {
    if (priceRange === 'all') return products;
    
    const [min, max] = priceRange.split('-').map(Number);
    return products.filter(product => 
      product.price >= min && product.price <= max
    );
  };

  const sortProducts = (products) => {
    switch (sortBy) {
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'newest':
        return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return [...products].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return products;
    }
  };

  const getFilteredAndSortedProducts = (category) => {
    // Đầu tiên lọc theo category
    let filteredProducts = filterProductsByCategory(category);
    
    // Sau đó lọc theo subcategory nếu có
    if (selectedSubCategory) {
      filteredProducts = filterBySubCategory(filteredProducts, category, selectedSubCategory);
    }
    
    // Tiếp theo lọc theo giá
    filteredProducts = filterByPrice(filteredProducts);
    
    // Cuối cùng sắp xếp
    filteredProducts = sortProducts(filteredProducts);
    
    return filteredProducts;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://ngochieuwedding.io.vn/api/tuyen/product');
        const data = await response.json();
        setProducts(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filterProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  const getCurrentPageProducts = (category) => {
    const filteredProducts = getFilteredAndSortedProducts(category);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  };

  const getTotalPages = (category) => {
    const filteredProducts = getFilteredAndSortedProducts(category);
    return Math.ceil(filteredProducts.length / productsPerPage);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const notifySuccess = () => toast.success('Đã thêm vào giỏ hàng!', {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const notifyError = () => toast.error('Vui lòng chọn size và màu sắc!', {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
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

      try {
        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        currentCart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(currentCart));
        
        notifySuccess();
        onClose();
      } catch (err) {
        toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
        console.error(err);
      }
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
                    <h4 className="font-semibold mb-2">Màu sắc: 
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        {selectedColor || 'Chưa chọn màu'}
                      </span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.colors && product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 border rounded-lg text-sm transition-all
                            ${selectedColor === color 
                              ? 'bg-black text-white border-black' 
                              : 'hover:bg-gray-100 border-gray-300'}`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Kích thước: 
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        {selectedSize || 'Chưa chọn size'}
                      </span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes && product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-14 h-14 flex items-center justify-center border rounded-lg text-sm transition-all
                            ${selectedSize === size 
                              ? 'bg-black text-white border-black' 
                              : 'hover:bg-gray-100 border-gray-300'}`}
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

                  {/* Thêm vào giỏ hàng */}
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => {
                        navigate(`/product/${product._id}`);
                        onClose();
                      }}
                      className="flex-1 bg-gray-100 text-black py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      Xem chi tiết
                    </button>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!selectedSize || !selectedColor}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {!selectedSize || !selectedColor 
                        ? 'Vui lòng chọn size và màu' 
                        : 'Thêm vào giỏ hàng'
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // const handleSearch = (e) => {
  //   const value = e.target.value;
  //   setSearchTerm(value);
  //   if (value.trim()) {
  //     setShowSuggestions(true);
  //     const searchResults = products.filter(product =>
  //       product.name.toLowerCase().includes(value.toLowerCase())
  //     );
  //     setSearchResults(searchResults);
  //   } else {
  //     setShowSuggestions(false);
  //     setSearchResults([]);
  //   }
  // };

  // const highlightText = (text) => {
  //   if (!searchTerm) return text;
  //   const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  //   return (
  //     <span>
  //       {parts.map((part, index) => 
  //         part.toUpperCase() === searchTerm.toUpperCase() ? (
  //           <span key={index} className="bg-yellow-200">{part}</span>
  //         ) : (
  //           part
  //         )
  //       )}
  //     </span>
  //   );
  // };

  // Reset trang khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, sortBy, selectedSubCategory]);

  return (
    <div className="container mx-auto px-4">
      <SearchBar className="max-w-xl mx-auto mb-8" />
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-8">Sản Phẩm MT Fashion</h1>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-4 border-b border-gray-200 mb-8 relative">
          {categories.map((category) => (
            <div
              key={category.name}
              className="relative"
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Tab
                className={({ selected }) =>
                  `px-6 py-3 text-lg font-medium outline-none ${
                    selected
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-300'
                  }`
                }
              >
                {category.name}
              </Tab>
              
              {/* Menu dropdown */}
              {hoveredCategory === category.name && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                  {subCategories[category.name].map((subCat) => (
                    <button
                      key={subCat}
                      onClick={() => {
                        setSelectedSubCategory(subCat);
                        setSelectedTab(categories.findIndex(c => c.name === category.name));
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 hover:text-black"
                    >
                      {subCat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Tab.List>

        <Tab.Panels>
          {categories.map((category) => (
            <Tab.Panel key={category.name}>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <>
                  {/* Filters and Sort */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                      {priceRanges.map((range) => (
                        <button
                          key={range.value}
                          onClick={() => setPriceRange(range.value)}
                          className={`px-4 py-2 rounded-lg text-sm transition-all
                            ${priceRange === range.value
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                    
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Hiển thị số lượng sản phẩm tìm thấy */}
                  <div className="text-sm text-gray-600 mb-4">
                    Tìm thấy {getFilteredAndSortedProducts(category.name).length} sản phẩm
                  </div>

                  {selectedSubCategory && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-4">
                        {selectedSubCategory}
                      </h2>
                      <button
                        onClick={() => setSelectedSubCategory(null)}
                        className="text-blue-600 hover:text-blue-800 mb-4"
                      >
                        ← Xem tất cả
                      </button>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                    {getCurrentPageProducts(category.name).map((product) => (
                      <div
                        key={product._id}
                        className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                      >
                        <div 
                          className="relative w-[80] h-[300px]  overflow-hidden cursor-pointer"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <img
                            src={product.img}
                            alt={product.name}
                            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                            <div className="flex gap-3">
                              <button 
                                onClick={() => navigate(`/product/${product._id}`)}
                                className="bg-white text-black px-6 py-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-100 transform hover:-translate-y-1"
                              >
                                Xem chi tiết
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProduct(product);
                                }}
                                className="bg-white text-black px-6 py-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-100 transform hover:-translate-y-1 flex items-center gap-2"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Thêm vào giỏ
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-lg font-medium text-gray-900 mb-3 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-xl font-semibold text-yellow-600 mt-auto">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(product.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Hiển thị thông báo khi không có sản phẩm */}
                  {getCurrentPageProducts(category.name).length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <ShoppingCart className="w-16 h-16 mx-auto" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Không tìm thấy sản phẩm
                      </h3>
                      <p className="text-gray-500">
                        Vui lòng thử lại với bộ lọc khác
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {!selectedSubCategory && getTotalPages(category.name) > 1 && (
                    <div className="mt-8 flex justify-center">
                      <nav className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border'
                          }`}
                        >
                          Trước
                        </button>
                        
                        {[...Array(getTotalPages(category.name))].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === index + 1
                                ? 'bg-black text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === getTotalPages(category.name)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === getTotalPages(category.name)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border'
                          }`}
                        >
                          Sau
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

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
    </div>
  );
}
