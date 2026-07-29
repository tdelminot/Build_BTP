import apiClient from './client';

export const materialAPI = {
  // Créer un matériel
  create: (data) => apiClient.post('/materials', data),
  
  // Obtenir tous les matériels
  getAll: (params) => apiClient.get('/materials', { params }),
  
  // Obtenir un matériel par ID
  getById: (id) => apiClient.get(`/materials/${id}`),
  
  // Mettre à jour un matériel
  update: (id, data) => apiClient.put(`/materials/${id}`, data),
  
  // Mettre à jour la quantité
  updateQuantity: (id, data) => apiClient.patch(`/materials/${id}/quantity`, data),
  
  // Affecter à un projet
  assignToProject: (id, data) => apiClient.post(`/materials/${id}/assign`, data),
  
  // Obtenir les matériels par projet
  getByProject: (projectId) => apiClient.get(`/materials/project/${projectId}`),
  
  // Obtenir les alertes de stock
  getAlerts: () => apiClient.get('/materials/alerts'),
  
  // Obtenir les statistiques
  getStats: () => apiClient.get('/materials/stats'),
  
  // Supprimer un matériel
  delete: (id) => apiClient.delete(`/materials/${id}`),
};

export default materialAPI;