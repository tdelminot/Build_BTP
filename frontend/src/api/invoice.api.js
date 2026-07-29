import apiClient from './client';

export const invoiceAPI = {
  create: (data) => apiClient.post('/invoices', data),
  getAll: (params) => apiClient.get('/invoices', { params }),
  getById: (id) => apiClient.get(`/invoices/${id}`),
  update: (id, data) => apiClient.put(`/invoices/${id}`, data),
  send: (id) => apiClient.patch(`/invoices/${id}/send`),
  recordPayment: (id, data) => apiClient.post(`/invoices/${id}/payment`, data),
  getOverdue: () => apiClient.get('/invoices/overdue'),
  getStats: () => apiClient.get('/invoices/stats'),
  delete: (id) => apiClient.delete(`/invoices/${id}`),
};

export default invoiceAPI;