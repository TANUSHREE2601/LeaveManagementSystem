import api from './api';

export const leaveService = {
  // Apply for leave (Employee)
  applyLeave: async (leaveData) => {
    const response = await api.post('/leaves/apply', leaveData);
    return response.data;
  },

  // Get my leaves (Employee)
  getMyLeaves: async (params = {}) => {
    const response = await api.get('/leaves/my-leaves', { params });
    return response.data;
  },

  // Get all leaves (Employer)
  getAllLeaves: async (params = {}) => {
    const response = await api.get('/leaves/all', { params });
    return response.data;
  },

  // Approve leave (Employer)
  approveLeave: async (leaveId) => {
    const response = await api.patch(`/leaves/${leaveId}/approve`);
    return response.data;
  },

  // Reject leave (Employer)
  rejectLeave: async (leaveId) => {
    const response = await api.patch(`/leaves/${leaveId}/reject`);
    return response.data;
  },
};
