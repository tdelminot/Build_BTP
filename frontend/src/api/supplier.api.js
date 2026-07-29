import apiClient from './client';

export const supplierAPI = {
  create: (data) => apiClient.post('/suppliers', data),
  getAll: (params) => apiClient.get('/suppliers', { params }),
  getById: (id) => apiClient.get(`/suppliers/${id}`),
  update: (id, data) => apiClient.put(`/suppliers/${id}`, data),
  delete: (id) => apiClient.delete(`/suppliers/${id}`),
};

export default supplierAPI;