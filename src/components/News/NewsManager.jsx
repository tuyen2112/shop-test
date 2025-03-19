import React, { useState, useEffect } from "react";
import { Pencil, Trash2, X } from "lucide-react";

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [newsData, setNewsData] = useState({
    title: "",
    thumbnail: "",
    description: "",
    body: "",
    tags: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("https://ngochieuwedding.io.vn/api/tuyen/news");
      if (!response.ok) throw new Error("Không thể tải tin tức");
      const data = await response.json();
      setNews(data.data || []);
    } catch (error) {
      alert("Lỗi khi tải tin tức: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewsData((prevData) => ({
      ...prevData,
      [name]: name === "tags" ? value : value,
    }));
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setNewsData({
      title: item.title,
      thumbnail: item.thumbnail,
      description: item.description,
      body: item.body,
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    
    try {
      const response = await fetch(`https://ngochieuwedding.io.vn/api/tuyen/news/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Lỗi khi xóa bài viết");
      
      setNews(news.filter(item => item._id !== id));
      alert("Xóa bài viết thành công!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId 
        ? `https://ngochieuwedding.io.vn/api/tuyen/news/${editingId}`
        : "https://ngochieuwedding.io.vn/api/tuyen/news";
      
      const method = editingId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newsData,
          tags: newsData.tags.split(",").map(tag => tag.trim()),
        }),
      });
      
      if (!response.ok) {
        throw new Error(editingId ? "Lỗi khi cập nhật bài viết" : "Lỗi khi thêm bài viết");
      }

      alert(editingId ? "Cập nhật bài viết thành công!" : "Thêm bài viết thành công!");
      await fetchNews();
      resetForm();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewsData({
      title: "",
      thumbnail: "",
      description: "",
      body: "",
      tags: "",
    });
    setEditingId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {editingId ? "Cập nhật bài viết" : "Thêm bài viết mới"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề
            </label>
            <input
              type="text"
              name="title"
              value={newsData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL hình ảnh
            </label>
            <input
              type="text"
              name="thumbnail"
              value={newsData.thumbnail}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả ngắn
            </label>
            <textarea
              name="description"
              value={newsData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung bài viết
            </label>
            <textarea
              name="body"
              value={newsData.body}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md h-48"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (cách nhau bởi dấu phẩy)
            </label>
            <input
              type="text"
              name="tags"
              value={newsData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Đang xử lý..." : editingId ? "Cập nhật" : "Thêm mới"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        {/* Danh sách tin tức */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Danh sách bài viết</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {news.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={item.thumbnail} alt={item.title} className="h-16 w-16 object-cover rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsManager;
