import apiClient from './client';

export const authAPI = {
  // Inscription
  register: (userData) => apiClient.post('/auth/register', userData),
  
  // Connexion
  login: (credentials) => apiClient.post('/auth/login', credentials),
  
  // Profil
  getProfile: () => apiClient.get('/auth/profile'),
  
  // Rafraîchir le token
  refreshToken: () => apiClient.post('/auth/refresh-token'),
  
  // Changer mot de passe
  changePassword: (data) => apiClient.post('/auth/change-password', data),
};

export default authAPI;