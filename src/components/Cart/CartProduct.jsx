import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, ShoppingCart, X } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const handleDelete = (index) => {
    const newCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newCartItems);
    localStorage.setItem("cart", JSON.stringify(newCartItems));
    toast.success("Đã xóa sản phẩm!");
  };

  const handleEdit = async (item, index) => {
    setIsLoading(true);
    try {
      // Fetch tất cả sản phẩm từ API
      const response = await fetch('https://ngochieuwedding.io.vn/api/tuyen/product');
      const { data } = await response.json();
      
      // Tìm sản phẩm cụ thể dựa trên id
      const productData = data.find(product => product._id === item.id);
      
      if (productData) {
        setSelectedProduct({
          ...productData,
          index,
          currentSize: item.size,
          currentColor: item.color
        });
        setSelectedSize(item.size);
        setSelectedColor(item.color);
      } else {
        toast.error('Không tìm thấy thông tin sản phẩm');
      }
    } catch (_) {
      toast.error('Không thể lấy thông tin sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Vui lòng chọn size và màu sắc!");
      return;
    }

    const updatedCartItems = cartItems.map((item, index) => {
      if (index === selectedProduct.index) {
        return {
          ...item,
          size: selectedSize,
          color: selectedColor
        };
      }
      return item;
    });

    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    setSelectedProduct(null);
    setSelectedSize(null);
    setSelectedColor(null);
    toast.success("Đã cập nhật sản phẩm!");
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá!');
      return;
    }

    try {
      const discounts = JSON.parse(localStorage.getItem('discounts')) || [];
      const discount = discounts.find(d => d.code === discountCode.trim().toUpperCase());
      
      if (!discount) {
        toast.error('Mã giảm giá không tồn tại!');
        return;
      }

      // Kiểm tra thời hạn
      const now = new Date();
      const validFrom = new Date(discount.validFrom);
      const validTo = new Date(discount.validTo);

      if (now < validFrom || now > validTo) {
        toast.error('Mã giảm giá đã hết hạn hoặc chưa có hiệu lực!');
        return;
      }

      // Kiểm tra giá trị đơn hàng tối thiểu
      const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
      if (cartTotal < discount.minPurchase) {
        toast.error(`Giá trị đơn hàng tối thiểu phải từ ${new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(discount.minPurchase)}!`);
        return;
      }

      // Kiểm tra sản phẩm áp dụng
      if (discount.productId !== 'all') {
        const hasValidProduct = cartItems.some(item => item.id === discount.productId);
        if (!hasValidProduct) {
          toast.error('Mã giảm giá không áp dụng cho các sản phẩm trong giỏ hàng!');
          return;
        }
      }

      // Lưu mã giảm giá đã áp dụng vào localStorage
      localStorage.setItem('appliedDiscount', JSON.stringify({
        ...discount,
        appliedItems: cartItems.map(item => ({
          id: item.id,
          price: item.price,
          discountedPrice: item.price - calculateItemDiscount(item)
        }))
      }));
      
      setAppliedDiscount(discount);
      toast.success('Áp dụng mã giảm giá thành công!');

    } catch (err) {
      console.error(err);
      toast.error('Không thể áp dụng mã giảm giá');
    }
  };

  const calculateItemDiscount = (item) => {
    if (!appliedDiscount) return 0;

    // Nếu mã giảm giá chỉ áp dụng cho sản phẩm cụ thể
    if (appliedDiscount.productId !== 'all' && appliedDiscount.productId !== item.id) {
      return 0;
    }

    // Tính giảm giá
    if (appliedDiscount.type === 'percentage') {
      return (item.price * appliedDiscount.value) / 100;
    } else {
      // Nếu là giảm giá cố định, chia đều cho các sản phẩm được áp dụng
      const applicableItems = cartItems.filter(cartItem => 
        appliedDiscount.productId === 'all' || cartItem.id === appliedDiscount.productId
      );
      return appliedDiscount.value / applicableItems.length;
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const discount = calculateItemDiscount(item);
      return total + (item.price - discount);
    }, 0);
  };

  // Thêm hàm xóa mã giảm giá
  const handleRemoveDiscount = () => {
    localStorage.removeItem('appliedDiscount');
    setAppliedDiscount(null);
    setDiscountCode('');
    toast.success('Đã hủy mã giảm giá');
  };

  // Popup component
  const EditPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="relative">
            <button 
              onClick={() => {
                setSelectedProduct(null);
                setSelectedSize(null);
                setSelectedColor(null);
              }}
              className="absolute right-4 top-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <img 
                    src={selectedProduct.img} 
                    alt={selectedProduct.name}
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">{selectedProduct.name}</h3>
                  <p className="text-xl font-semibold text-yellow-600 mb-4">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(selectedProduct.price)}
                  </p>

                  {/* Màu sắc */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Màu sắc:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors?.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 border rounded-lg text-sm transition-all
                            ${selectedColor === color 
                              ? 'bg-black text-white border-black' 
                              : 'hover:border-black'}`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Kích thước:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes?.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 flex items-center justify-center border rounded-lg text-sm transition-all
                            ${selectedSize === size 
                              ? 'bg-black text-white border-black' 
                              : 'hover:border-black'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Thông tin hiện tại */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Lựa chọn hiện tại:</h4>
                    <p className="text-gray-600">Size: {selectedProduct.currentSize}</p>
                    <p className="text-gray-600">Màu sắc: {selectedProduct.currentColor}</p>
                  </div>

                  {/* Mô tả */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Mô tả:</h4>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>

                  <button
                    onClick={handleUpdateCart}
                    disabled={!selectedSize || !selectedColor}
                    className={`w-full py-3 rounded-lg flex items-center justify-center gap-2
                      ${(!selectedSize || !selectedColor) 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-black text-white hover:bg-gray-800'} 
                      transition-colors`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Cập nhật giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">Giỏ hàng trống</p>
          <button
            onClick={() => navigate('/detail')}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 inline-flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Sản phẩm</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Size</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Màu sắc</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Số lượng</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Giá</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Giảm giá</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Thành tiền</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map((item, index) => {
                  const discount = calculateItemDiscount(item);
                  const finalPrice = (item.price - discount) * item.quantity;
                  
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{item.size}</td>
                      <td className="px-6 py-4">{item.color}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              const newCartItems = [...cartItems];
                              if (newCartItems[index].quantity > 1) {
                                newCartItems[index].quantity -= 1;
                                setCartItems(newCartItems);
                                localStorage.setItem("cart", JSON.stringify(newCartItems));
                              }
                            }}
                            className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => {
                              const newCartItems = [...cartItems];
                              newCartItems[index].quantity += 1;
                              setCartItems(newCartItems);
                              localStorage.setItem("cart", JSON.stringify(newCartItems));
                            }}
                            className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(item.price)}
                      </td>
                      <td className="px-6 py-4 text-green-600">
                        {discount > 0 ? `-${new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(discount)}` : '-'}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(finalPrice)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(item, index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Mã giảm giá</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                disabled={isCheckingDiscount || appliedDiscount}
              />
              {appliedDiscount ? (
                <button
                  onClick={handleRemoveDiscount}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Hủy mã
                </button>
              ) : (
                <button
                  onClick={handleApplyDiscount}
                  disabled={isCheckingDiscount}
                  className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors
                    ${isCheckingDiscount 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-black text-white hover:bg-gray-800'}`}
                >
                  {isCheckingDiscount ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : 'Áp dụng'}
                </button>
              )}
            </div>
            {appliedDiscount && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-600 font-medium">
                  Đã áp dụng mã giảm giá: {appliedDiscount.code}
                </p>
                <p className="text-sm text-green-500">
                  {appliedDiscount.type === 'percentage' 
                    ? `Giảm ${appliedDiscount.value}%` 
                    : `Giảm ${new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(appliedDiscount.value)}`
                  }
                  {appliedDiscount.productId !== 'all' && ' cho sản phẩm được chọn'}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/detail')}
              className="bg-white border border-black text-black px-6 py-2 rounded-lg hover:bg-gray-50 inline-flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              Tiếp tục mua sắm
            </button>
            <div className="text-right">
              <p className="text-gray-600 mb-2">Tổng tiền:</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(calculateTotal())}
              </p>
              {appliedDiscount && (
                <p className="text-sm text-green-600">
                  (Đã áp dụng giảm giá)
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={() => navigate('/checkout')}
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800"
            >
              Tiến hành thanh toán
            </button>
        </div>
        </>
      )}

      {selectedProduct && <EditPopup />}
    </div>
  );
}
