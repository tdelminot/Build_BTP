import apiClient from './client';

export const teamAPI = {
  create: (data) => apiClient.post('/teams', data),
  getAll: (params) => apiClient.get('/teams', { params }),
  getById: (id) => apiClient.get(`/teams/${id}`),
  update: (id, data) => apiClient.put(`/teams/${id}`, data),
  delete: (id) => apiClient.delete(`/teams/${id}`),
};

export default teamAPI;