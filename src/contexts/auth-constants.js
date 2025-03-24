// src/contexts/constants.js
export const STORAGE_KEYS = {
  USER: 'user',
  USERS: 'users'
};

export const ADMIN_CREDENTIALS = {
  username: 'admin123',
  password: '21122000'
};

export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: 'Đăng ký thành công! Vui lòng đăng nhập.',
  REGISTER_ERROR: 'Đăng ký thất bại',
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  LOGIN_ADMIN_SUCCESS: 'Đăng nhập admin thành công!',
  LOGIN_ERROR: 'Đăng nhập thất bại',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  LOGOUT_ERROR: 'Đăng xuất thất bại',
  USERNAME_EXISTS: 'Tên đăng nhập đã tồn tại!',
  INVALID_CREDENTIALS: 'Tên đăng nhập hoặc mật khẩu không đúng!'
};
