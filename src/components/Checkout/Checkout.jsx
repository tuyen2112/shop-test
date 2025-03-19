import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import { ShoppingBag, CreditCard, ArrowLeft } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedDiscount = JSON.parse(localStorage.getItem("appliedDiscount"));
    setCartItems(storedCart);
    setAppliedDiscount(storedDiscount);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateItemPrice = (item) => {
    if (!appliedDiscount) return item.price;

    if (appliedDiscount.productId !== 'all' && appliedDiscount.productId !== item.id) {
      return item.price;
    }

    if (appliedDiscount.type === 'percentage') {
      return item.price * (1 - appliedDiscount.value / 100);
    } else {
      const applicableItems = cartItems.filter(cartItem => 
        appliedDiscount.productId === 'all' || cartItem.id === appliedDiscount.productId
      );
      const discountPerItem = appliedDiscount.value / applicableItems.length;
      return Math.max(0, item.price - discountPerItem);
    }
  };

  const calculateSubTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const calculateTotalDiscount = () => {
    if (!appliedDiscount) return 0;
    
    return cartItems.reduce((total, item) => {
      const originalPrice = item.price;
      const discountedPrice = calculateItemPrice(item);
      return total + (originalPrice - discountedPrice);
    }, 0);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemPrice(item), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }

    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const newOrder = {
        id: Date.now(),
        items: cartItems.map(item => ({
          ...item,
          finalPrice: calculateItemPrice(item)
        })),
        customerInfo: formData,
        appliedDiscount,
        total: calculateTotal(),
        orderDate: new Date().toISOString(),
        status: 'Đang xử lý'
      };
      
      orderHistory.push(newOrder);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      
      // Xóa giỏ hàng và mã giảm giá sau khi đặt hàng thành công
      localStorage.removeItem('cart');
      localStorage.removeItem('appliedDiscount');

      toast.success("Đặt hàng thành công! Cảm ơn bạn đã mua hàng.", {
        onClose: () => navigate('/')
      });
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      <div className="container mx-auto py-10 px-4">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center text-gray-600 hover:text-black mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Quay lại giỏ hàng
        </button>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Thanh toán</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex items-center mb-6">
                  <ShoppingBag className="w-6 h-6 mr-2" />
                  <h3 className="text-xl font-semibold">Thông tin đơn hàng</h3>
                </div>
                
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{item.name}</h4>
                        <p className="text-gray-600 text-sm mb-1">
                          Size: {item.size} | Màu: {item.color}
                        </p>
                        <div className="flex items-center gap-2">
                          {calculateItemPrice(item) < item.price && (
                            <p className="text-gray-500 line-through text-sm">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(item.price)}
                            </p>
                          )}
                          <p className="text-yellow-600 font-medium">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(calculateItemPrice(item))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-6 pt-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(calculateSubTotal())}
                      </span>
                    </div>

                    {appliedDiscount && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>
                          Giảm giá ({appliedDiscount.type === 'percentage' 
                            ? `${appliedDiscount.value}%` 
                            : 'Cố định'
                          }):
                        </span>
                        <span>
                          - {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(calculateTotalDiscount())}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-lg pt-2 border-t">
                      <span className="font-medium">Tổng tiền:</span>
                      <span className="text-2xl font-bold text-yellow-600">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-6 h-6 mr-2" />
                  <h3 className="text-xl font-semibold">Thông tin thanh toán</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="0xxxxxxxxx"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Địa chỉ giao hàng
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                      rows="3"
                      placeholder="Nhập địa chỉ giao hàng"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center text-lg font-medium"
                  >
                    Xác nhận đặt hàng
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
