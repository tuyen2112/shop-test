import { PRODUCT_CATEGORIES } from '../../constants/admin';

const ProductForm = ({ 
  productData, 
  editingProductId, 
  loading, 
  handleInputChange, 
  handlePriceChange, 
  handleStockChange, 
  handleResetForm, 
  handleSaveProduct 
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {editingProductId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleResetForm}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none focus:border-transparent"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Hủy
          </button>
          <button 
            onClick={handleSaveProduct} 
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white flex items-center gap-2
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-black hover:bg-gray-800 focus:ring-2 focus:ring-black focus:outline-none'
              }`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {loading ? 'Đang xử lý...' : (editingProductId ? 'Cập nhật' : 'Thêm mới')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Image */}
        {productData.img && (
          <div className="lg:col-span-3">
            <div className="relative h-64 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
              <img
                src={productData.img}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x200?text=Ảnh+không+tồn+tại';
                }}
              />
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Thông tin cơ bản
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={productData.name || ''}
                onChange={handleInputChange('name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none focus:border-transparent"
                placeholder="Nhập tên sản phẩm"
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={productData.category || ''}
                onChange={handleInputChange('category')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none focus:border-transparent"
                required
              >
                {PRODUCT_CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="price"
                  value={productData.price || ''}
                  onChange={handlePriceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none focus:border-transparent pr-12"
                  placeholder="Nhập giá sản phẩm"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">VNĐ</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {productData.price ? `${parseInt(productData.price || 0).toLocaleString('vi-VN')} VNĐ` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Thông tin chi tiết
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng
              </label>
              <input
                type="text"
                name="stock"
                value={productData.stock || ''}
                onChange={handleStockChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none focus:border-transparent"
                placeholder="Nhập số lượng sản phẩm"
              />
              <p className="mt-1 text-sm text-gray-500">
                {productData.stock ? `${parseInt(productData.stock || 0).toLocaleString('vi-VN')} sản phẩm` : ''}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL hình ảnh
              </label>
              <input
                type="text"
                name="img"
                value={productData.img || ''}
                onChange={handleInputChange('img')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none focus:border-transparent"
                placeholder="Nhập URL hình ảnh"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhà sản xuất
              </label>
              <input
                type="text"
                value={productData.product_by}
                onChange={handleInputChange('product_by')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none focus:border-transparent"
                placeholder="Nhập tên nhà sản xuất"
              />
            </div>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Thông tin bổ sung
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Màu sắc
              </label>
              <input
                type="text"
                value={productData.colors}
                onChange={handleInputChange('colors')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none focus:border-transparent"
                placeholder="Phân cách bằng dấu phẩy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kích thước
              </label>
              <input
                type="text"
                value={productData.sizes}
                onChange={handleInputChange('sizes')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none focus:border-transparent"
                placeholder="Phân cách bằng dấu phẩy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={productData.description}
                onChange={handleInputChange('description')}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none focus:border-transparent resize-none"
                placeholder="Nhập mô tả sản phẩm"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm; 