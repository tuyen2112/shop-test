import React, { useState } from "react";

export default function Log({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  
  };

  // Xử lý đăng nhập
  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.phone && formData.password) {
      alert("Đăng nhập thành công!");
      onLogin(true);
    } else {
      alert("Vui lòng nhập số điện thoại và mật khẩu!");
    }
  };

  // Xử lý đăng ký
  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    alert("Đăng ký thành công!");
    setIsRegister(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">{isRegister ? "Đăng Ký" : "Đăng Nhập"}</h2>
        
        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <div className="mb-3">
              <label className="block text-sm font-semibold">Tên:</label>
              <input
                type="text"
                name="name"
                className="w-full border p-2 rounded"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="block text-sm font-semibold">Số Điện Thoại:</label>
            <input
              type="tel"
              name="phone"
              className="w-full border p-2 rounded"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold">Mật Khẩu:</label>
            <input
              type="password"
              name="password"
              className="w-full border p-2 rounded"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {isRegister && (
            <div className="mb-3">
              <label className="block text-sm font-semibold">Xác Nhận Mật Khẩu:</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full border p-2 rounded"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button className="w-full bg-blue-500 text-white p-2 rounded mt-3">
            {isRegister ? "Đăng Ký" : "Đăng Nhập"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button onClick={() => setIsRegister(!isRegister)} className="text-blue-600 text-sm">
            {isRegister ? "Quay lại đăng nhập" : "Chưa có tài khoản? Đăng ký"}
          </button>
        </div>
      </div>
    </div>
  );
}
