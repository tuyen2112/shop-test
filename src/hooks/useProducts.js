import { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL, INITIAL_PRODUCT_DATA, PRODUCTS_PER_PAGE } from '../constants/admin';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState(INITIAL_PRODUCT_DATA);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = useCallback(async () => {
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
  }, []);

  const handleInputChange = useCallback((field) => (event) => {
    const value = event.target.value;
    setProductData(prevState => ({ ...prevState, [field]: value }));
  }, []);

  const handlePriceChange = useCallback((event) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    setProductData(prevState => ({ ...prevState, price: value }));
  }, []);

  const handleStockChange = useCallback((event) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    setProductData(prevState => ({ ...prevState, stock: value }));
  }, []);

  const handleResetForm = useCallback(() => {
    setProductData(INITIAL_PRODUCT_DATA);
    setEditingProductId(null);
  }, []);

  const handleSaveProduct = useCallback(async () => {
    try {
      setLoading(true);
      const productToSave = {
        ...productData,
        price: parseFloat(productData.price) || 0,
        stock: parseInt(productData.stock) || 0,
        colors: productData.colors.split(",").map(c => c.trim()).filter(Boolean),
        sizes: productData.sizes.split(",").map(s => s.trim()).filter(Boolean),
      };

      if (editingProductId) {
        await axios.put(`${API_URL}/${editingProductId}`, productToSave);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await axios.post(API_URL, productToSave);
        toast.success("Thêm sản phẩm mới thành công!");
      }

      handleResetForm();
      fetchProducts();
    } catch (error) {
      toast.error("Lỗi khi lưu sản phẩm: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [productData, editingProductId, handleResetForm, fetchProducts]);

  const handleDeleteProduct = useCallback(async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Xóa sản phẩm thành công!");
        fetchProducts();
      } catch (error) {
        toast.error("Lỗi khi xóa sản phẩm: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  }, [fetchProducts]);

  const handleEditProduct = useCallback((product) => {
    setProductData({
      ...product,
      colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
    });
    setEditingProductId(product._id);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = !searchCategory || product.category === searchCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchText, searchCategory]);

  const currentProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, currentPage]);

  const totalPages = useMemo(() => 
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
    [filteredProducts.length]
  );

  const handleSearch = useCallback((searchText, category) => {
    setSearchText(searchText);
    setSearchCategory(category);
    setCurrentPage(1);
  }, []);

  const handlePaginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  return {
    products: currentProducts,
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
  };
}; 