import api from './api';

export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await api.get('/auth/verify');
      return response;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};