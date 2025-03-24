import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import DiscountManager from "./DiscountManager";
import WareHouse from "./WareHouse";
import NewsManager from "../News/NewsManager";
import ProductList from './ProductList';
import TopMenu from './TopMenu';
import ProductForm from './ProductForm';
import ProductTabs from './ProductTabs';
import { useProducts } from '../../hooks/useProducts';
import { SECTIONS, TABS } from '../../constants/admin';
import { useAuth } from '../../contexts/useAuth';

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
  const [activeSection, setActiveSection] = useState(SECTIONS.PRODUCTS);
  const [activeTab, setActiveTab] = useState(TABS.LIST);

  const {
    products,
    productData,
    editingProductId,
    loading,
    totalPages,
    currentPage,
    handleInputChange,
    handlePriceChange,
    handleStockChange,
    handleResetForm,
    handleSaveProduct,
    handleDeleteProduct,
    handleEditProduct,
    handleSearch,
    handlePaginate,
    fetchProducts
  } = useProducts();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Bạn không có quyền truy cập trang này');
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopMenu activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg">
            {activeSection === SECTIONS.PRODUCTS && (
              <div className="p-6">
                <ProductTabs 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  resetForm={handleResetForm}
                />
                {activeTab === TABS.LIST ? (
                  <div>
                    <ProductSearch onSearch={handleSearch} />
                    <ProductList 
                      products={products}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                      onPaginate={handlePaginate}
                      loading={loading}
                    />
                  </div>
                ) : (
                  <ProductForm 
                    productData={productData}
                    editingProductId={editingProductId}
                    loading={loading}
                    handleInputChange={handleInputChange}
                    handlePriceChange={handlePriceChange}
                    handleStockChange={handleStockChange}
                    handleResetForm={handleResetForm}
                    handleSaveProduct={handleSaveProduct}
                  />
                )}
              </div>
            )}

            {activeSection === SECTIONS.DISCOUNTS && (
              <div className="p-6">
                <DiscountManager />
              </div>
            )}

            {activeSection === SECTIONS.WAREHOUSE && (
              <div className="p-6">
                <WareHouse />
              </div>
            )}

            {activeSection === SECTIONS.NEWS && (
              <div className="p-6">
                <NewsManager />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
