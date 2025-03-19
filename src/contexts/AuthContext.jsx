import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = async (username, password) => {
    try {
      // Kiểm tra tài khoản admin
      if (username === 'admin123' && password === '21122000') {
        const adminData = {
          name: 'Admin',
          username: username,
          role: 'admin',
          isAdmin: true
        };
        setUser(adminData);
        localStorage.setItem('user', JSON.stringify(adminData));
        toast.success('Đăng nhập thành công!');
        return adminData;
      }

      // Xử lý đăng nhập user thường
      const response = await fetch('https://ngochieuwedding.io.vn/api/tuyen/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      const userData = {
        ...data.user,
        token: data.token,
        isAdmin: false
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Đăng nhập thành công!');
      return userData;

    } catch (error) {
      toast.error(error.message || 'Đăng nhập thất bại');
      throw error;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Đăng xuất thành công!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Đăng xuất thất bại');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 