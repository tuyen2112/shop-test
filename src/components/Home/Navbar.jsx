import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, ShoppingCart, Eye } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchBar from "../Search/SearchBar";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Navbar() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const notifySuccess = () =>
    toast.success("Đã thêm vào giỏ hàng!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

  const notifyError = () =>
    toast.error("Vui lòng chọn size và màu sắc!", {
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
      keywords: [
        "NAM",
        "THỜI TRANG NAM",
        "QUẦN ÁO NAM",
        "ĐỒ NAM",
        "FASHION MEN",
        "MEN",
      ],
    },
    {
      name: "Nữ",
      keywords: [
        "NỮ",
        "THỜI TRANG NỮ",
        "QUẦN ÁO NỮ",
        "ĐỒ NỮ",
        "FASHION WOMEN",
        "WOMEN",
      ],
    },
    {
      name: "Trẻ em",
      keywords: [
        "TRẺ EM",
        "THỜI TRANG TRẺ EM",
        "QUẦN ÁO TRẺ EM",
        "ĐỒ TRẺ EM",
        "KIDS",
        "CHILDREN",
      ],
    },
  ];

  useEffect(() => {
    fetch("https://ngochieuwedding.io.vn/api/tuyen/product")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data.slice(0, 5));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
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
        const response = await fetch(
          "https://ngochieuwedding.io.vn/api/tuyen/product"
        );
        const { data } = await response.json();

        // Tìm kiếm sản phẩm
        const searchValue = value.toUpperCase();
        const results = data.filter((product) => {
          const nameMatch = product.name.toUpperCase().includes(searchValue);
          const categoryMatch = product.category
            .toUpperCase()
            .includes(searchValue);
          const descriptionMatch = product.description
            ?.toUpperCase()
            .includes(searchValue);
          return nameMatch || categoryMatch || descriptionMatch;
        });

        // Nhóm kết quả theo danh mục
        const groupedResults = {};
        results.forEach((product) => {
          if (!groupedResults[product.category]) {
            groupedResults[product.category] = [];
          }
          groupedResults[product.category].push(product);
        });

        setSearchResults(groupedResults);
      } catch (error) {
        console.error("Error searching:", error);
        toast.error("Có lỗi xảy ra khi tìm kiếm");
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
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toUpperCase() === searchTerm.toUpperCase() ? (
            <span key={index} className="bg-yellow-200">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const handleSelectCategory = (category) => {
    navigate(`/detail?category=${category}`);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const filteredCategories = categories.filter((category) => {
    const searchValue = searchTerm.toUpperCase();
    return (
      category.keywords.some((keyword) => keyword.includes(searchValue)) ||
      category.name.toUpperCase().includes(searchValue)
    );
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
        quantity: 1,
      };

      try {
        const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
        currentCart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(currentCart));

        notifySuccess();
        onClose();
      } catch (err) {
        toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
        console.error(err);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-2 top-2 sm:right-4 sm:top-4 z-10 bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                <div className="w-full md:w-1/2">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-[300px] sm:h-[400px] object-cover rounded-lg"
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                    {product.name}
                  </h3>
                  <p className="text-lg sm:text-xl font-semibold text-yellow-600 mb-3 sm:mb-4">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </p>

                  {/* Màu sắc */}
                  <div className="mb-4 sm:mb-6">
                    <h4 className="font-semibold mb-2">
                      Màu sắc:
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        {selectedColor || "Chưa chọn màu"}
                      </span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.colors?.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 sm:px-4 sm:py-2 border rounded-lg text-sm transition-all
                            ${
                              selectedColor === color
                                ? "bg-black text-white border-black"
                                : "hover:bg-gray-100 border-gray-300"
                            }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="mb-4 sm:mb-6">
                    <h4 className="font-semibold mb-2">
                      Kích thước:
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        {selectedSize || "Chưa chọn size"}
                      </span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes?.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border rounded-lg text-sm transition-all
                            ${
                              selectedSize === size
                                ? "bg-black text-white border-black"
                                : "hover:bg-gray-100 border-gray-300"
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mô tả */}
                  <div className="mb-4 sm:mb-6">
                    <h4 className="font-semibold mb-2">Mô tả:</h4>
                    <p className="text-gray-600 text-sm sm:text-base line-clamp-3 sm:line-clamp-none">
                      {product.description}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={() => {
                        navigate(`/product/${product._id}`);
                        onClose();
                      }}
                      className="w-full sm:flex-1 bg-gray-100 text-black py-2.5 sm:py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      Xem chi tiết
                    </button>

                    <button
                      onClick={handleAddToCart}
                      disabled={!selectedSize || !selectedColor}
                      className="w-full sm:flex-1 bg-black text-white py-2.5 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      {!selectedSize || !selectedColor
                        ? "Chọn size và màu"
                        : "Thêm vào giỏ"}
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

  return (
    <header className="bg-white">
      <ToastContainer />
      <div className="container mx-auto px-4">
        <SearchBar className="max-w-xl mx-auto mb-8 md:mb-12" />
      </div>

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
                1024: { slidesPerView: 3 },
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
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
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
