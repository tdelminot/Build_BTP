import apiClient from './client';

export const projectAPI = {
  create: (data) => apiClient.post('/projects', data),
  getAll: (params) => apiClient.get('/projects', { params }),
  getById: (id) => apiClient.get(`/projects/${id}`),
  update: (id, data) => apiClient.put(`/projects/${id}`, data),
  updateProgress: (id, progress) => apiClient.patch(`/projects/${id}/progress`, { progress }),
  getActive: () => apiClient.get('/projects/active'),
  getStats: () => apiClient.get('/projects/stats'),
  delete: (id) => apiClient.delete(`/projects/${id}`),
};

export default projectAPI;