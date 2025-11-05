import api from './api';

export const attendanceService = {
  // Mark attendance for single user
  markAttendance: async (attendanceData) => {
    try {
      const response = await api.post('/attendance/mark', attendanceData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to mark attendance');
    }
  },

  // Mark bulk attendance
  markBulkAttendance: async (bulkData) => {
    try {
      const response = await api.post('/attendance/mark/bulk', bulkData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to mark bulk attendance');
    }
  },

  // Get user attendance
  getUserAttendance: async (userId) => {
    try {
      const response = await api.get(`/attendance/user/${userId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch attendance');
    }
  },

  // Get attendance stats
  getAttendanceStats: async (userId) => {
    try {
      const response = await api.get(`/attendance/user/${userId}/stats`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch attendance stats');
    }
  },

  // Get attendance by date
  getAttendanceByDate: async (date) => {
    try {
      const response = await api.get(`/attendance/date/${date}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch attendance by date');
    }
  },

  // Get all attendance
  getAllAttendance: async () => {
    try {
      const response = await api.get('/attendance/all');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch all attendance');
    }
  },

  // Update attendance
  updateAttendance: async (attendanceId, status) => {
    try {
      const response = await api.put(`/attendance/${attendanceId}`, { status });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update attendance');
    }
  }
};