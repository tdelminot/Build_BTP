export const handleApiError = (error) => {
  const defaultMessage = 'Une erreur est survenue';
  
  if (error.response) {
    // Erreur avec réponse du serveur
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Données invalides';
      case 401:
        return 'Session expirée, veuillez vous reconnecter';
      case 403:
        return 'Vous n\'avez pas les permissions nécessaires';
      case 404:
        return 'Ressource non trouvée';
      case 409:
        return 'Conflit: cette ressource existe déjà';
      case 422:
        return data.message || 'Erreur de validation';
      case 429:
        return 'Trop de requêtes, veuillez réessayer plus tard';
      case 500:
        return 'Erreur interne du serveur';
      default:
        return data.message || defaultMessage;
    }
  } else if (error.request) {
    // Erreur de réseau
    return 'Erreur réseau, vérifiez votre connexion';
  } else {
    // Autre erreur
    return error.message || defaultMessage;
  }
};

export const isNetworkError = (error) => {
  return error.code === 'ECONNABORTED' || 
         error.message === 'Network Error' ||
         error.code === 'ERR_NETWORK';
};