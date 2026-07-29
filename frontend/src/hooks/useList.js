import { useState, useEffect, useCallback, useRef } from 'react';

export const useList = (fetchFn, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  
  const isMounted = useRef(true);
  const isFetching = useRef(false);
  const initialFetchDone = useRef(false);

  const fetchData = useCallback(async (params = {}) => {
    //  Éviter les appels multiples simultanés
    if (isFetching.current) return;
    
    try {
      isFetching.current = true;
      setLoading(true);
      setError(null);
      
      const response = await fetchFn({ ...options, ...params });
      
      if (!isMounted.current) return;
      
      // Extraction robuste des données
      let extractedData = [];
      if (response?.data?.data && Array.isArray(response.data.data)) {
        extractedData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        extractedData = response.data;
      } else if (Array.isArray(response)) {
        extractedData = response;
      } else if (response?.data && typeof response.data === 'object') {
        const firstArray = Object.values(response.data).find(Array.isArray);
        if (firstArray) extractedData = firstArray;
      }
      
      setData(extractedData);
      
      if (response?.data?.pagination) {
        setPagination(response.data.pagination);
      } else if (response?.pagination) {
        setPagination(response.pagination);
      }
      
    } catch (err) {
      if (isMounted.current) {
        //  IGNORER LE 401 (non connecté)
        if (err.response?.status === 401) {
          console.log('📊 401 ignoré - données vides (utilisateur non connecté)');
          setData([]);
          setError(null);  
        } else {
          setError(err.message || 'Erreur de chargement');
          setData([]);
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      isFetching.current = false;
    }
  }, [fetchFn, options]);

  //  Utiliser un effet avec des dépendances stables
  useEffect(() => {
    isMounted.current = true;
    
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchData();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchData]);

  //  Fonction pour forcer le rafraîchissement
  const refetch = useCallback((params = {}) => {
    initialFetchDone.current = true;
    return fetchData(params);
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error, 
    pagination, 
    refetch,
    setData 
  };
};