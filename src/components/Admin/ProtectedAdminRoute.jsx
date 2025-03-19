import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    toast.error('Vui lòng đăng nhập để truy cập trang này');
    return <Navigate to="/login" />;
  }

  if (!user.isAdmin) {
    toast.error('Bạn không có quyền truy cập trang này');
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedAdminRoute;
