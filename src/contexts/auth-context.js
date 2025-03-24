// src/contexts/AuthContext.js
import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {}
});
