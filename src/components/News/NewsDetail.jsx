import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Clock, Tag, Calendar, Eye, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNewsDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      // Fetch bài viết chi tiết
      const response = await fetch(`https://ngochieuwedding.io.vn/api/tuyen/news/${id}`);
      if (!response.ok) throw new Error("Không thể tải tin tức");
      const data = await response.json();
      console.log("News detail:", data); // Debug
      setNews(data.data); // Thêm .data

      // Fetch bài viết liên quan
      const allNewsResponse = await fetch("https://ngochieuwedding.io.vn/api/tuyen/news");
      const allNewsData = await allNewsResponse.json();
      console.log("All news:", allNewsData); // Debug
      
      // Lọc bài viết liên quan
      const filtered = allNewsData.data // Thêm .data
        .filter(item => item._id !== id)
        .slice(0, 3);
      setRelatedNews(filtered);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Lỗi khi tải tin tức: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h2>
        <Link 
          to="/news" 
          className="flex items-center text-yellow-500 hover:text-yellow-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Quay lại trang tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={news.thumbnail}
          alt={news.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-4 text-white/80 mb-4">
                <span className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  {formatDate(news.createdAt)}
                </span>
                <span className="flex items-center">
                  <Eye size={16} className="mr-2" />
                  235 lượt xem
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {news.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-500/20 text-white backdrop-blur-sm rounded-full flex items-center text-sm"
                  >
                    <Tag size={14} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/news"
            className="inline-flex items-center text-gray-600 hover:text-yellow-500 mb-8 transition-colors"
          >
            <ChevronLeft size={20} className="mr-2" />
            Quay lại tin tức
          </Link>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                {/* Description */}
                <div className="text-xl text-gray-600 mb-8 font-medium leading-relaxed border-l-4 border-yellow-500 pl-6">
                  {news.description}
                </div>

                {/* Content */}
                <div className="text-gray-800 space-y-6">
                  {news.body.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Chia sẻ bài viết:</span>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Share2 size={20} className="text-gray-600" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Eye size={16} />
                    <span>235 lượt xem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Bài viết liên quan</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedNews.map((item) => (
                  <Link
                    key={item._id}
                    to={`/news/${item._id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="relative overflow-hidden aspect-w-16 aspect-h-9">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-yellow-500 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mt-4">
                          <Calendar size={14} className="mr-2" />
                          {formatDate(item.createdAt)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsDetail; 