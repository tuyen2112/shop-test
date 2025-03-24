import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { STORAGE_KEYS, ADMIN_CREDENTIALS, AUTH_MESSAGES } from './auth-constants';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const register = async (username, password, name) => {
    try {
      // Validate input
      if (!username || !password || !name) {
        throw new Error('Vui lòng điền đầy đủ thông tin!');
      }

      const trimmedUsername = username.trim();
      const trimmedName = name.trim();

      if (!trimmedUsername || !trimmedName) {
        throw new Error('Tên đăng nhập và họ tên không được để trống!');
      }

      // Check if username exists
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      if (users.some(u => u.username && u.username.toLowerCase() === trimmedUsername.toLowerCase())) {
        throw new Error('Tên đăng nhập đã tồn tại!');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: trimmedName,
        username: trimmedUsername,
        password: password,
        isAdmin: false,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      return newUser;
    } catch (error) {
      toast.error(error.message || 'Đăng ký thất bại');
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      // Validate input
      if (!username || !password) {
        throw new Error('Vui lòng điền đầy đủ thông tin!');
      }

      const trimmedUsername = username.trim();
      if (!trimmedUsername) {
        throw new Error('Tên đăng nhập không được để trống!');
      }

      // Check admin account
      if (trimmedUsername === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const adminUser = {
          id: 'admin',
          name: 'Admin',
          username: trimmedUsername,
          isAdmin: true,
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(adminUser));
        toast.success('Đăng nhập admin thành công!');
        return adminUser;
      }

      // Check regular user
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const foundUser = users.find(u => 
        u.username && u.username.toLowerCase() === trimmedUsername.toLowerCase() && 
        u.password === password
      );

      if (!foundUser) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng!');
      }

      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        username: foundUser.username,
        isAdmin: false
      };

      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      toast.success(`Xin chào, ${userData.name}!`);
      return userData;
    } catch (error) {
      toast.error(error.message || 'Đăng nhập thất bại');
      throw error;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
      toast.success('Đăng xuất thành công!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Đăng xuất thất bại');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
