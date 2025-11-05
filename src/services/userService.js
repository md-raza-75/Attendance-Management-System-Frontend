import api from './api';

export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch users');
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch user');
    }
  },

  // Create user
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create user');
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update user');
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete user');
    }
  },

  // Get users by role
  getUsersByRole: async (role) => {
    try {
      const response = await api.get(`/users/role/${role}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch users by role');
    }
  }
};