import { useEffect, useState } from "react";
import DiscountManager from "./DiscountManager";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import WareHouse from "./WareHouse";
import axios from 'axios';
import NewsManager from "../News/NewsManager";

const API_URL = "https://ngochieuwedding.io.vn/api/tuyen/product";

// Định nghĩa các trường và label tương ứng
const FIELD_LABELS = {
  category: "Danh mục",
  name: "Tên sản phẩm",
  stock: "Số lượng",
  mileage: "Khoảng cách",
  price: "Giá",
  img: "Hình ảnh URL",
  product_by: "Nhà sản xuất",
  colors: "Màu sắc (phân cách bằng dấu phẩy)",
  year: "Năm sản xuất",
  description: "Mô tả",
  sizes: "Kích thước (phân cách bằng dấu phẩy)"
};

const ProductSearch = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchText, category);
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Tìm kiếm sản phẩm</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-6">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Nhập tên sản phẩm cần tìm..."
            className="form-input"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input min-w-[250px]"
          >
            <option value="">Tất cả danh mục</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Trẻ em">Trẻ em</option>
          </select>
          <button type="submit" className="button primary min-w-[200px]">
            Tìm kiếm
          </button>
        </div>
      </form>
    </section>
  );
};

export default function AdminProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({
    category: "",
    name: "",
    stock: "",
    mileage: "",
    price: "",
    img: "",
    product_by: "",
    colors: "",
    year: "",
    description: "",
    sizes: ""
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [activeSection, setActiveSection] = useState('products');
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add' or 'edit'

  useEffect(() => {
    // Kiểm tra quyền admin
    if (!user || user.role !== 'admin') {
      toast.error('Bạn không có quyền truy cập trang này');
      navigate('/login');
    }
  }, [user, navigate]);

  // Lấy danh sách sản phẩm từ API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (error) {
      toast.error("Không thể tải sản phẩm: " + error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thêm & cập nhật sản phẩm
  const handleSaveProduct = async () => {
    try {
      setLoading(true);
      // Validate required fields
      if (!productData.name || !productData.category || !productData.price) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc (tên, danh mục, giá)');
      }

      const dataToSend = {
        name: productData.name,
        category: productData.category,
        price: Number(productData.price),
        stock: Number(productData.stock) || 0,
        mileage: productData.mileage,
        img: productData.img,
        product_by: productData.product_by,
        colors: productData.colors ? productData.colors.split(",").map(c => c.trim()).filter(Boolean) : [],
        year: Number(productData.year) || new Date().getFullYear(),
        description: productData.description,
        sizes: productData.sizes ? productData.sizes.split(",").map(s => s.trim()).filter(Boolean) : []
      };

      if (editingProductId) {
        // Xóa sản phẩm cũ
        const deleteResponse = await axios.delete(`${API_URL}/${editingProductId}`);
        if (deleteResponse.data.success) {
          toast.info("Đang cập nhật sản phẩm...");
          
          // Tạo sản phẩm mới
          const createResponse = await axios.post(
            API_URL,
            dataToSend,
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
          
          if (createResponse.data.success) {
            toast.success("Cập nhật sản phẩm thành công!");
            // Cập nhật state products
            setProducts(prevProducts => {
              const filteredProducts = prevProducts.filter(p => p._id !== editingProductId);
              return [...filteredProducts, createResponse.data.data];
            });
          }
        }
      } else {
        // Thêm sản phẩm mới
        const response = await axios.post(
          API_URL,
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        
        if (response.data.success) {
          toast.success("Thêm sản phẩm mới thành công!");
          setProducts(prevProducts => [...prevProducts, response.data.data]);
        }
      }

      // Reset form và refresh data
      setProductData({
        category: "", 
        name: "", 
        stock: "", 
        mileage: "", 
        price: "", 
        img: "",
        product_by: "", 
        colors: "", 
        year: "", 
        description: "", 
        sizes: ""
      });
      setEditingProductId(null);
      setActiveTab('list'); // Reset tab to list
      fetchProducts(); // Refresh lại data từ server

    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý sửa sản phẩm
  const handleEditProduct = (product) => {
    try {
      if (!product || !product._id) {
        throw new Error('Không tìm thấy thông tin sản phẩm');
      }
      
      // Chuyển đổi dữ liệu để hiển thị trong form
      setProductData({
        category: product.category || "",
        name: product.name || "",
        stock: product.stock || "",
        mileage: product.mileage || "",
        price: product.price || "",
        img: product.img || "",
        product_by: product.product_by || "",
        colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
        year: product.year || "",
        description: product.description || "",
        sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : ""
      });
      setEditingProductId(product._id);
      setActiveTab('edit'); // Thêm state mới cho tab edit

      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error("Lỗi khi tải thông tin sản phẩm: " + error.message);
    }
  };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Xóa sản phẩm thành công");
      fetchProducts();
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const TopMenu = () => (
    <div className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">MT Fashion Admin</h1>
          </div>

          {/* Navigation Menu */}
          <nav className="flex space-x-1 ml-10">
            <MenuItem 
              text="Quản lý sản phẩm"
              active={activeSection === 'products'}
              onClick={() => setActiveSection('products')}
              icon={<BoxIcon />}
            />
            <MenuItem 
              text="Quản lý mã giảm giá"
              active={activeSection === 'discount'}
              onClick={() => setActiveSection('discount')}
              icon={<TagIcon />}
            />
            <MenuItem 
              text="Quản lý kho hàng"
              active={activeSection === 'warehouse'}
              onClick={() => setActiveSection('warehouse')}
              icon={<WarehouseIcon />}
            />
            <MenuItem 
              text="Quản lý bài viết"
              active={activeSection === 'news'}
              onClick={() => setActiveSection('news')}
              icon={<FileTextIcon />}
            />
          </nav>
        </div>
      </div>
    </div>
  );

  const MenuItem = ({ text, active, onClick, icon }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-md transition-all ${
        active 
          ? 'bg-yellow-500 text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="w-5 h-5 mr-2">{icon}</span>
      <span className="font-medium">{text}</span>
    </button>
  );

  // Product Section Tabs
  const ProductTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        <button
          onClick={() => {
            setActiveTab('list');
            resetForm(); // Thêm hàm reset form
          }}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'list'
              ? 'border-yellow-500 text-yellow-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Danh sách sản phẩm
        </button>
        <button
          onClick={() => {
            setActiveTab('add');
            resetForm();
          }}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'edit'
              ? 'border-yellow-500 text-yellow-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {activeTab === 'edit' ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </button>
      </nav>
    </div>
  );

  // Reset form function
  const resetForm = () => {
    setProductData({
      category: "",
      name: "",
      stock: "",
      mileage: "",
      price: "",
      img: "",
      product_by: "",
      colors: "",
      year: "",
      description: "",
      sizes: ""
    });
    setEditingProductId(null);
  };

  // Form component
  const ProductForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Preview Image */}
        {productData.img && (
          <div className="lg:col-span-3">
            <div className="relative h-48 rounded-lg overflow-hidden">
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
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              value={productData.category}
              onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              required
            >
              <option value="">Chọn danh mục</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Trẻ em">Trẻ em</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">VNĐ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Thông tin chi tiết</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng
            </label>
            <input
              type="number"
              value={productData.stock}
              onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL hình ảnh
            </label>
            <input
              type="text"
              value={productData.img}
              onChange={(e) => setProductData({ ...productData, img: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhà sản xuất
            </label>
            <input
              type="text"
              value={productData.product_by}
              onChange={(e) => setProductData({ ...productData, product_by: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Thông tin bổ sung</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Màu sắc
            </label>
            <input
              type="text"
              value={productData.colors}
              onChange={(e) => setProductData({ ...productData, colors: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
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
              onChange={(e) => setProductData({ ...productData, sizes: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Phân cách bằng dấu phẩy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              rows="3"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          onClick={handleSaveProduct}
          disabled={loading}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Đang xử lý...' : (editingProductId ? 'Cập nhật' : 'Thêm mới')}
        </button>
      </div>
    </div>
  );

  // Icons
  const BoxIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4m16 0l-8 4m8 4l-8 4m8-4l-8 4m8-4v-4m-16 4l8-4m-8 4l8 4m-8-4v-4m8 4v-4" />
    </svg>
  );

  const TagIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );

  const WarehouseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  const FileTextIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopMenu />
      
      <div className="pt-16"> {/* Add padding-top to account for fixed header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Content section */}
          <div className="bg-white rounded-lg shadow-lg">
            {activeSection === 'products' && (
              <div className="p-6">
                <ProductTabs />
                {activeTab === 'list' ? (
                  <div>
                    <ProductSearch onSearch={(searchText, category) => {
                      setSearchTerm(searchText);
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }} />
                    {/* Bảng danh sách sản phẩm */}
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Danh sách sản phẩm</h2>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hình ảnh
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên sản phẩm
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Danh mục
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giá
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số lượng
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentProducts.length ? currentProducts.map((product) => (
                              <tr key={product._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="h-16 w-16 rounded-lg overflow-hidden">
                                    <img
                                      src={product.img || 'https://via.placeholder.com/150?text=No+Image'}
                                      alt={product.name}
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {product.category}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {product.price?.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {product.stock}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button 
                                    onClick={() => handleEditProduct(product)} 
                                    disabled={loading}
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                  >
                                    Sửa
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProduct(product._id)} 
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Xóa
                                  </button>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                  Không có sản phẩm nào
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="px-6 py-4 flex justify-center">
                          <nav className="flex items-center space-x-2">
                            <button
                              onClick={() => paginate(currentPage - 1)}
                              disabled={currentPage === 1}
                              className={`px-3 py-1 rounded-md ${
                                currentPage === 1
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              Trước
                            </button>
                            
                            {[...Array(totalPages)].map((_, index) => (
                              <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`px-3 py-1 rounded-md ${
                                  currentPage === index + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {index + 1}
                              </button>
                            ))}
                            
                            <button
                              onClick={() => paginate(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className={`px-3 py-1 rounded-md ${
                                currentPage === totalPages
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              Sau
                            </button>
                          </nav>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <ProductForm />
                )}
              </div>
            )}

            {activeSection === 'discount' && (
              <div className="p-6">
                <DiscountManager />
              </div>
            )}

            {activeSection === 'warehouse' && (
              <div className="p-6">
                <WareHouse />
              </div>
            )}

            {activeSection === 'news' && (
              <div className="p-6">
               <NewsManager/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
