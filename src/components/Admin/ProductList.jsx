import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ProductList = ({ onDelete, loading }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const productsPerPage = 10;
  const API_URL = "https://ngochieuwedding.io.vn/api/tuyen/product";

  // Lấy danh sách sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_URL, {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        const productList = Array.isArray(data) ? data : data?.data || [];
        console.log("Danh sách sản phẩm từ API:", productList); // Debug
        setProducts(productList);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        toast.error(`Lỗi khi lấy sản phẩm: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Phân trang
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  // Chọn sản phẩm để chỉnh sửa và gọi lại API
  const handleEdit = async (product) => {
    if (!product?._id) {
      toast.error("Sản phẩm trong danh sách không có ID!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/${product._id}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Dữ liệu từ API khi mở popup:", data); // Debug dữ liệu API
      const productData = { ...data, _id: data._id || product._id };
      setEditProduct(productData); // Hiển thị popup với dữ liệu mới
      setUpdatedProduct({ ...productData }); // Đồng bộ dữ liệu để chỉnh sửa
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      toast.error(`Lỗi khi lấy thông tin sản phẩm: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      // Fallback: Sử dụng dữ liệu từ danh sách nếu API lỗi
      setEditProduct({ ...product });
      setUpdatedProduct({ ...product });
    } finally {
      setIsLoading(false);
    }
  };

  // Thay đổi giá trị trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: name === "colors" || name === "sizes" ? value.split(", ").filter(Boolean) : value,
    }));
  };

  // Cập nhật sản phẩm: Xóa cũ, tạo mới
  const handleUpdate = async () => {
    if (!editProduct?._id) {
      toast.error("Không có ID sản phẩm để cập nhật!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      setIsLoading(true);
      const productId = editProduct._id;

      // Xóa sản phẩm cũ
      const deleteResponse = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!deleteResponse.ok) throw new Error(`Xóa sản phẩm thất bại! Status: ${deleteResponse.status}`);

      // Chuẩn bị dữ liệu mới
      const newProductData = {
        category: updatedProduct.category || editProduct.category,
        name: updatedProduct.name?.trim() || editProduct.name,
        stock: updatedProduct.stock !== undefined ? Number(updatedProduct.stock) : editProduct.stock,
        price: updatedProduct.price !== undefined ? Number(updatedProduct.price) : editProduct.price,
        img: updatedProduct.img?.trim() || editProduct.img,
        product_by: "tuyen",
        colors: updatedProduct.colors?.length ? updatedProduct.colors : editProduct.colors || [],
        sizes: updatedProduct.sizes?.length ? updatedProduct.sizes : editProduct.sizes || [],
        description: updatedProduct.description?.trim() || editProduct.description || "",
      };

      // Validate dữ liệu
      if (!newProductData.name?.trim()) throw new Error("Tên sản phẩm không được để trống");
      if (!newProductData.category?.trim()) throw new Error("Danh mục không được để trống");
      if (!newProductData.price || newProductData.price <= 0) throw new Error("Giá sản phẩm phải lớn hơn 0");
      if (!newProductData.stock || newProductData.stock < 0) throw new Error("Số lượng không được âm");

      // Tạo sản phẩm mới
      const createResponse = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProductData),
      });
      if (!createResponse.ok) throw new Error(`Tạo sản phẩm mới thất bại! Status: ${createResponse.status}`);
      const newProduct = await createResponse.json();

      // Cập nhật danh sách sản phẩm
      setProducts((prev) => [...prev.filter((p) => p._id !== productId), newProduct]);
      toast.success("Cập nhật sản phẩm thành công!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Đóng popup
      setEditProduct(null);
      setUpdatedProduct({});
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast.error(`Lỗi khi cập nhật: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa sản phẩm ngay lập tức
  const handleDelete = async (productId) => {
    try {
      setIsLoading(true);
      await onDelete(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Xóa sản phẩm thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error(`Lỗi khi xóa: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Danh sách sản phẩm</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : currentProducts.length ? (
              currentProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.img || "https://via.placeholder.com/150"}
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded-lg"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {product.price?.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(product)}
                      disabled={loading || isLoading}
                      className="text-blue-600 hover:text-blue-900 mr-4 px-3 py-1 rounded-md border border-blue-600 transition-colors disabled:opacity-50"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={loading || isLoading}
                      className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md border border-red-600 transition-colors disabled:opacity-50"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Không có sản phẩm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!isLoading && products.length > 0 && (
        <div className="flex justify-center items-center py-4 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-4 py-2 border rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } transition-colors`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Sau
          </button>
        </div>
      )}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[70vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h3>
              <button
                onClick={() => setEditProduct(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 text-sm font-medium text-gray-700 w-1/3">
                      <label>Danh mục</label>
                      <select
                        name="category"
                        value={updatedProduct.category || ""}
                        onChange={handleChange}
                        className="mt-1 w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="">Chọn danh mục</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Trẻ em">Trẻ em</option>
                      </select>
                    </td>
                    <td className="py-2 px-3 text-sm font-medium text-gray-700 w-1/3">
                      <label>Tên sản phẩm</label>
                      <input
                        type="text"
                        name="name"
                        value={updatedProduct.name || ""}
                        onChange={handleChange}
                        className="mt-1 w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Nhập tên sản phẩm"
                      />
                    </td>
                    <td className="py-2 px-3 text-sm font-medium text-gray-700 w-1/3">
                      <label>Số lượng</label>
                      <input
                        type="number"
                        name="stock"
                        value={updatedProduct.stock || ""}
                        onChange={handleChange}
                        min="0"
                        className="mt-1 w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Nhập số lượng"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 text-sm font-medium text-gray-700 w-1/3">
                      <label>Giá</label>
                      <input
                        type="number"
                        name="price"
                        value={updatedProduct.price || ""}
                        onChange={handleChange}
                        min="0"
                        className="mt-1 w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Nhập giá"
                      />
                    </td>
                    <td className="py-2 px-3 text-sm font-medium text-gray-700 w-1/3">
                      <label>URL hình ảnh</label>
                      <input
                        type="text"
                        name="img"
                        value={updatedProduct.img || ""}
                        onChange={handleChange}
                        className="mt-1 w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Nhập URL hình ảnh"
                      />
                    </td>
                    <td className="py-2 px-3 text-sm font-medium text-gray-700 w-1/3">
                      <label>Màu sắc</label>
                      <input
                        type="text"
                        name="colors"
                        value={updatedProduct.colors?.join(", ") || ""}
                        onChange={handleChange}
                        className="mt-1 w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Nhập màu sắc"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-sm font-medium text-gray-700 w-1/3">
                      <label>Kích cỡ</label>
                      <input
                        type="text"
                        name="sizes"
                        value={updatedProduct.sizes?.join(", ") || ""}
                        onChange={handleChange}
                        className="mt-1 w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Nhập kích cỡ"
                      />
                    </td>
                    <td className="py-2 px-3 text-sm font-medium text-gray-700 w-2/3" colSpan="2">
                      <label>Mô tả</label>
                      <textarea
                        name="description"
                        value={updatedProduct.description || ""}
                        onChange={handleChange}
                        rows="2"
                        className="mt-1 w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Nhập mô tả sản phẩm"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setEditProduct(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;