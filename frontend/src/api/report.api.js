import apiClient from './client';

export const reportAPI = {
  getFinancial: (params) => apiClient.get('/reports/financial', { params }),
  getProfitability: (params) => apiClient.get('/reports/profitability', { params }),
  getProject: (id) => apiClient.get(`/reports/project/${id}`),
  getExpenses: (params) => apiClient.get('/reports/expenses', { params }),
  getHR: (params) => apiClient.get('/reports/hr', { params }),
  getMaterials: () => apiClient.get('/reports/materials'),
  getGlobal: (params) => apiClient.get('/reports/global', { params }),
  exportPDF: (params) => apiClient.get('/reports/export/pdf', { params, responseType: 'blob' }),
};

export default reportAPI;