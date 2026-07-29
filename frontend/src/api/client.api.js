import apiClient from './client';

export const clientAPI = {
  // Créer un client
  create: (data) => apiClient.post('/clients', data),
  
  // Obtenir tous les clients
  getAll: (params) => apiClient.get('/clients', { params }),
  
  // Obtenir un client par ID
  getById: (id) => apiClient.get(`/clients/${id}`),  // ← ✅ backticks
  
  // Mettre à jour un client
  update: (id, data) => apiClient.put(`/clients/${id}`, data),  // ← ✅ backticks
  
  // Supprimer un client
  delete: (id) => apiClient.delete(`/clients/${id}`),  // ← ✅ backticks
};

export default clientAPI;