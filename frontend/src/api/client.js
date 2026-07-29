import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Une erreur est survenue';
    
    //  NE PAS REDIRIGER POUR LE DASHBOARD ET LES PAGES PUBLIQUES
    const isPublicRequest = error.config?.url?.includes('/dashboard') ||
                            error.config?.url?.includes('/projects') ||
                            error.config?.url?.includes('/employees') ||
                            error.config?.url?.includes('/materials') ||
                            error.config?.url?.includes('/invoices') ||
                            error.config?.url?.includes('/clients') ||
                            error.config?.url?.includes('/suppliers') ||
                            error.config?.url?.includes('/reports');
    
    if (error.response?.status === 401) {
      //  Si c'est une requête publique, ne pas rediriger
      if (isPublicRequest) {
        console.log('📊 Requête publique: 401 ignoré');
        return Promise.reject(error);
      }
      
      //  Sinon, rediriger vers login (uniquement pour les routes protégées)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expirée, veuillez vous reconnecter');
    } else if (error.response?.status === 403) {
      toast.error('Vous n\'avez pas les permissions nécessaires');
    } else if (error.response?.status === 404) {
      toast.error('Ressource non trouvée');
    } else if (error.response?.status >= 500) {
      toast.error('Erreur serveur, veuillez réessayer plus tard');
    } else if (message) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;