import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Trash2, Plus } from 'lucide-react';

export default function DiscountManager() {
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage', // 'percentage' hoặc 'fixed'
    value: '',
    validFrom: '',
    validTo: '',
    productId: 'all', // 'all' hoặc id của sản phẩm cụ thể
    minPurchase: '0'
  });

  useEffect(() => {
    fetchDiscounts();
    fetchProducts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      // Lấy mã giảm giá từ localStorage
      const storedDiscounts = JSON.parse(localStorage.getItem('discounts')) || [];
      setDiscounts(storedDiscounts);
    } catch (error) {
      toast.error('Không thể tải danh sách mã giảm giá');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://ngochieuwedding.io.vn/api/tuyen/product');
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      toast.error('Không thể tải danh sách sản phẩm');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate dữ liệu
      if (formData.type === 'percentage' && formData.value > 100) {
        toast.error('Phần trăm giảm giá không thể vượt quá 100%');
        return;
      }

      // Tạo mã giảm giá mới
      const newDiscount = {
        _id: Date.now().toString(), // Tạo ID giả
        ...formData,
        code: formData.code.toUpperCase(),
        value: Number(formData.value),
        minPurchase: Number(formData.minPurchase)
      };

      // Lấy danh sách mã giảm giá hiện tại
      const currentDiscounts = JSON.parse(localStorage.getItem('discounts')) || [];

      // Kiểm tra mã đã tồn tại chưa
      if (currentDiscounts.some(d => d.code === newDiscount.code)) {
        toast.error('Mã giảm giá đã tồn tại!');
        return;
      }

      // Thêm mã mới vào danh sách
      const updatedDiscounts = [...currentDiscounts, newDiscount];
      
      // Lưu vào localStorage
      localStorage.setItem('discounts', JSON.stringify(updatedDiscounts));
      
      toast.success('Tạo mã giảm giá thành công!');
      setDiscounts(updatedDiscounts);

      // Reset form
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        validFrom: '',
        validTo: '',
        productId: 'all',
        minPurchase: '0'
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDiscount = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa mã giảm giá này?')) {
      try {
        // Lấy danh sách mã giảm giá hiện tại
        const currentDiscounts = JSON.parse(localStorage.getItem('discounts')) || [];
        
        // Lọc bỏ mã cần xóa
        const updatedDiscounts = currentDiscounts.filter(d => d._id !== id);
        
        // Cập nhật localStorage
        localStorage.setItem('discounts', JSON.stringify(updatedDiscounts));
        
        toast.success('Đã xóa mã giảm giá');
        setDiscounts(updatedDiscounts);
      } catch (error) {
        toast.error('Có lỗi xảy ra');
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Quản lý mã giảm giá</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form tạo mã giảm giá */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus size={20} />
            Tạo mã giảm giá mới
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mã giảm giá</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                placeholder="Nhập mã giảm giá"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Loại giảm giá</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              >
                <option value="percentage">Giảm theo phần trăm</option>
                <option value="fixed">Giảm số tiền cố định</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {formData.type === 'percentage' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (VNĐ)'}
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                min="0"
                max={formData.type === 'percentage' ? "100" : ""}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Áp dụng cho</label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              >
                <option value="all">Tất cả sản phẩm</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Giá trị đơn hàng tối thiểu</label>
              <input
                type="number"
                value={formData.minPurchase}
                onChange={(e) => setFormData({...formData, minPurchase: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                min="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
                <input
                  type="datetime-local"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
                <input
                  type="datetime-local"
                  value={formData.validTo}
                  onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white flex items-center justify-center gap-2
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Plus size={20} />
                  Tạo mã giảm giá
                </>
              )}
            </button>
          </form>
        </div>

        {/* Danh sách mã giảm giá */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Danh sách mã giảm giá</h3>
          <div className="space-y-4">
            {discounts.map(discount => (
              <div key={discount._id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-lg">{discount.code}</h4>
                    <p className="text-sm text-gray-600">
                      {discount.type === 'percentage' 
                        ? `Giảm ${discount.value}%` 
                        : `Giảm ${new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(discount.value)}`
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      {discount.productId === 'all' 
                        ? 'Áp dụng cho tất cả sản phẩm'
                        : `Áp dụng cho: ${products.find(p => p._id === discount.productId)?.name || 'Sản phẩm không tồn tại'}`
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      Hiệu lực: {new Date(discount.validFrom).toLocaleDateString()} - 
                      {new Date(discount.validTo).toLocaleDateString()}
                    </p>
                    {discount.minPurchase > 0 && (
                      <p className="text-sm text-gray-600">
                        Đơn hàng tối thiểu: {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(discount.minPurchase)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteDiscount(discount._id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            {discounts.length === 0 && (
              <p className="text-gray-500 text-center py-4">Chưa có mã giảm giá nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 