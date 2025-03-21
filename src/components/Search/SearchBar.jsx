import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SearchBar({ className }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.trim()) {
      try {
        setIsLoading(true);
        const response = await fetch('https://ngochieuwedding.io.vn/api/tuyen/product');
        const { data } = await response.json();
        const results = data.filter(p => 
          p.name.toLowerCase().includes(value.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(value.toLowerCase()))
        );
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải dữ liệu tìm kiếm");
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full pl-12 pr-10 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-black bg-white/90 backdrop-blur-sm"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSearchResults([]);
              setShowSearchResults(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {isLoading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
          </div>
        )}
      </div>

      {showSearchResults && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-xl border z-50 max-h-[60vh] overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {searchResults.map(item => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-yellow-600 font-medium mt-1">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(item.price)}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${item._id}`);
                          setShowSearchResults(false);
                          setSearchTerm('');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        Xem chi tiết
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy sản phẩm phù hợp
            </div>
          )}
        </div>
      )}
    </div>
  );
} 