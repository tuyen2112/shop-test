import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, Clock, Tag, Calendar, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const News = () => {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("https://ngochieuwedding.io.vn/api/tuyen/news");
      if (!response.ok) throw new Error("Không thể tải tin tức");
      const data = await response.json();
      console.log("Fetched data:", data); // Kiểm tra dữ liệu
      setNews(data.data || []); // Đảm bảo lấy đúng data từ response
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Lỗi khi tải tin tức: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil((news?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = news?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-black h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-black/50" />
        <div className="container mx-auto px-4 h-full flex flex-col justify-center text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tin Tức & Bài Viết
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Cập nhật những xu hướng thời trang mới nhất và những bài viết hữu ích
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500" />
          </div>
        ) : (
          <>
            {/* News Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((item) => (
                <article
                  key={item._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  onClick={() => setSelectedNews(item)}
                >
                  <div className="relative overflow-hidden aspect-w-16 aspect-h-9">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar size={16} className="mr-2" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-600 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(item.tags) && item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full flex items-center"
                        >
                          <Tag size={14} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded-lg border transition-colors ${
                      currentPage === index + 1
                        ? "bg-yellow-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* News Detail Popup */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 bg-white/80 backdrop-blur-sm"
            >
              <X size={24} />
            </button>
            
            <div className="relative h-[300px]">
              <img
                src={selectedNews.thumbnail}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDate(selectedNews.createdAt)}</span>
                </div>
                <div className="flex gap-2">
                  {selectedNews.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full flex items-center"
                    >
                      <Tag size={14} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-4">{selectedNews.title}</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                {selectedNews.description}
              </p>
              
              <div className="prose max-w-none line-clamp-4 mb-6 text-gray-600 leading-relaxed">
                {selectedNews.body.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t">
                <button
                  onClick={() => {
                    navigate(`/news/${selectedNews._id}`);
                    setSelectedNews(null);
                  }}
                  className="w-full py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center group"
                >
                  <span>Xem chi tiết bài viết</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
