import apiClient from './client';

export const dashboardAPI = {
  getDashboard: () => apiClient.get('/dashboard'),
  getProjectStats: () => apiClient.get('/dashboard/projects'),
  getEmployeeStats: () => apiClient.get('/dashboard/employees'),
  getFinancialStats: () => apiClient.get('/dashboard/financial'),
  getRecentActivities: (limit) => apiClient.get('/dashboard/activities', { params: { limit } }),
};

export default dashboardAPI;