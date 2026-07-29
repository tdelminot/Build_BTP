import apiClient from './client';

export const employeeAPI = {
  create: (data) => apiClient.post('/employees', data),
  getAll: (params) => apiClient.get('/employees', { params }),
  getById: (id) => apiClient.get(`/employees/${id}`),
  update: (id, data) => apiClient.put(`/employees/${id}`, data),
  assignToTeam: (id, teamId) => apiClient.patch(`/employees/${id}/team`, { teamId }),
  recordAttendance: (data) => apiClient.post('/employees/attendance', data),
  getAttendance: (id, params) => apiClient.get(`/employees/${id}/attendance`, { params }),
  getStats: () => apiClient.get('/employees/stats'),
};

export default employeeAPI;