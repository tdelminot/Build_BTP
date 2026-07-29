console.log('🚀🚀🚀 AUTHCONTEXT CHARGÉ !!! 🚀🚀🚀');

import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth.api';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AuthContext = createContext();

console.log('🚀 AuthContext après imports');

export const AuthProvider = ({ children }) => {
  console.log('🚀 AuthProvider render');
  
  const [user, setUser] = useLocalStorage('user', null);
  const [token, setToken] = useLocalStorage('token', null);
  const [loading, setLoading] = useState(true);

  console.log('🔍 AuthProvider - user initial:', user);
  console.log('🔍 AuthProvider - token initial:', token);

  useEffect(() => {
    console.log('🚀 AuthProvider useEffect');
    console.log('🔍 Token dans useEffect:', token);
    
    if (token) {
      authAPI.getProfile()
        .then(response => {
          console.log('✅ Profil récupéré:', response.data);
          setUser(response.data);
        })
        .catch((error) => {
          console.error('❌ Erreur profil:', error);
          setUser(null);
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    console.log('📤 LOGIN appelé pour:', email);
    
    try {
      const response = await authAPI.login({ email, password });
      
      console.log('📥 Réponse reçue - status:', response.status);
      console.log('📥 response.data:', response.data);
      
      const userData = response.data?.data?.user || null;
      const tokenData = response.data?.data?.token || null;
      
      console.log('✅ User extrait:', userData ? 'OK' : 'NULL');
      console.log('✅ Token extrait:', tokenData ? 'OK' : 'NULL');
      
      if (tokenData) {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);
        
        setUser(userData);
        setToken(tokenData);
        
        console.log('💾 TOKEN SAUVEGARDÉ !');
        console.log('💾 Vérification localStorage:', localStorage.getItem('token'));
      } else {
        console.error('❌ PAS DE TOKEN DANS LA RÉPONSE !');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const user = response.data?.data?.user || null;
      const token = response.data?.data?.token || null;
      
      if (token) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        setUser(user);
        setToken(token);
      }
      return response;
    } catch (error) {
      console.error('❌ Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const changePassword = async (oldPassword, newPassword) => {
    const response = await authAPI.changePassword({ oldPassword, newPassword });
    return response;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    changePassword,
    isAuthenticated: !!token && !!user
  };
  

  console.log('🚀 AuthProvider value - isAuthenticated:', value.isAuthenticated);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
