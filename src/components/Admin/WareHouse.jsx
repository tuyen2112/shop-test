import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WareHouse = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [warehouseData, setWarehouseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('https://ngochieuwedding.io.vn/api/tuyen/product');
        console.log('API Response:', response.data); // Debug log

        if (!response.data || !response.data.data) {
          throw new Error('Invalid data structure received from API');
        }

        const products = response.data.data.map(product => ({
          id: product._id || 'N/A',
          productName: product.name || 'Không có tên',
          averagePrice: product.price || 0,
          totalOrders: product.sold || 0,
          inStock: product.stock || 0,
          category: product.category || 'Chưa phân loại',
          lastUpdated: product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('vi-VN') : 'N/A',
        }));

        console.log('Processed Products:', products); // Debug log
        setWarehouseData(products);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const calculateTotalValue = (price, stock) => {
    return price * stock;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <p className="text-red-600">Lỗi: {error}</p>
      </div>
    );
  }

  if (!warehouseData.length) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <p className="text-yellow-600">Không có dữ liệu sản phẩm</p>
      </div>
    );
  }

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Quản lý kho hàng</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Tổng sản phẩm</p>
          <p className="text-2xl font-semibold mt-2">{warehouseData.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Tổng tồn kho</p>
          <p className="text-2xl font-semibold mt-2">
            {warehouseData.reduce((sum, item) => sum + item.inStock, 0)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Giá trị tồn kho</p>
          <p className="text-2xl font-semibold mt-2">
            {warehouseData.reduce((sum, item) => 
              sum + calculateTotalValue(item.averagePrice, item.inStock), 0).toLocaleString()}đ
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã SP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trung bình</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số đơn hàng</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cập nhật cuối</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị tồn kho</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {warehouseData.slice(startIndex, endIndex).map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{row.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{row.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{row.averagePrice.toLocaleString()}đ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{row.totalOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{row.inStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{row.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{row.lastUpdated}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {calculateTotalValue(row.averagePrice, row.inStock).toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
            >
              {[5, 10, 25].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} hàng mỗi trang
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Trước
            </button>
            <span className="text-sm text-gray-700">
              Trang {page + 1} / {Math.ceil(warehouseData.length / rowsPerPage)}
            </span>
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={endIndex >= warehouseData.length}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WareHouse;