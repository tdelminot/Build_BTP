import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      
      //  Si l'item est null ou undefined, retourner la valeur initiale
      if (item === null || item === undefined) {
        return initialValue;
      }
      
      //  Si c'est une chaîne JSON valide, la parser
      try {
        return JSON.parse(item);
      } catch {
        //  Si ce n'est pas du JSON valide (comme un token JWT), retourner la chaîne brute
        return item;
      }
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      // Si la valeur est une chaîne ou un objet, la stocker en JSON
      if (typeof storedValue === 'string') {
        localStorage.setItem(key, storedValue);
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error('Error writing localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};