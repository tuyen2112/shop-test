import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { toast } from 'react-toastify';
import { User, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register, user } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (isRegister) {
      if (!formData.name.trim()) {
        toast.error('Vui lòng nhập họ tên!');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Mật khẩu xác nhận không khớp!');
        return false;
      }
      if (formData.password.length < 6) {
        toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
        return false;
      }
    }
    if (!formData.username.trim()) {
      toast.error('Vui lòng nhập tên đăng nhập!');
      return false;
    }
    if (!formData.password) {
      toast.error('Vui lòng nhập mật khẩu!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (isRegister) {
        await register(formData.username, formData.password, formData.name);
        setIsRegister(false); // Switch to login form
        resetForm();
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      } else {
        const userData = await login(formData.username, formData.password);
        if (userData.isAdmin) {
          toast.success('Đăng nhập thành công với quyền Admin!');
          navigate('/admin');
        } else {
          toast.success('Đăng nhập thành công!');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      name: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegister ? "Đăng ký tài khoản" : "Đăng nhập"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isRegister ? "Tạo tài khoản mới" : "Đăng nhập để tiếp tục"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {isRegister && (
              <div className="relative">
                <label htmlFor="name" className="sr-only">
                  Họ tên
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Họ tên"
                />
              </div>
            )}

            <div className="relative">
              <label htmlFor="username" className="sr-only">
                Tên đăng nhập
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                  isRegister ? "" : "rounded-t-md"
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Tên đăng nhập"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                  isRegister ? "" : "rounded-b-md"
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Mật khẩu"
              />
            </div>

            {isRegister && (
              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">
                  Xác nhận mật khẩu
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Xác nhận mật khẩu"
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {loading
                ? "Đang xử lý..."
                : isRegister
                ? "Đăng ký"
                : "Đăng nhập"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                resetForm();
              }}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              {isRegister
                ? "Đã có tài khoản? Đăng nhập"
                : "Chưa có tài khoản? Đăng ký"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
