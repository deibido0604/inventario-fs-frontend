import { useCallback, useState, useEffect } from 'react';
import crypto from '../utils/crypto';

const useLocalStorage = () => {
  const [storage, setStorage] = useState({});

  useEffect(() => {
    const syncStorage = () => {
      const newStorage = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        newStorage[key] = localStorage.getItem(key);
      }
      setStorage(newStorage);
    };

    syncStorage();
    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);

  const removeItem = useCallback((key) => {
    localStorage.removeItem(key);
    setStorage(prev => {
      const newStorage = { ...prev };
      delete newStorage[key];
      return newStorage;
    });
  }, []);

  const setItemWithEncryption = useCallback((key, value) => {
    const encryptedValue = crypto.encryptString(
      value, 
      import.meta.env.VITE_APP_SECRET_KEY
    );
    localStorage.setItem(key, encryptedValue);
    setStorage(prev => ({ ...prev, [key]: encryptedValue }));
  }, []);

  const getItemWithDecryption = useCallback((key) => {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) return null;

    try {
      const decryptedValue = crypto.decryptString(
        encryptedValue, 
        import.meta.env.VITE_APP_SECRET_KEY
      );
      
      try {
        return JSON.parse(decryptedValue);
      } catch {
        return decryptedValue;
      }
    } catch (error) {
      console.error('Error decrypting:', error);
      return null;
    }
  }, []);

  const setItem = useCallback((key, value) => {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(key, stringValue);
    setStorage(prev => ({ ...prev, [key]: stringValue }));
  }, []);

  const getItem = useCallback((key) => {
    const value = localStorage.getItem(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }, []);

  const clear = useCallback(() => {
    localStorage.clear();
    setStorage({});
  }, []);

  return {
    storage,
    removeItem,
    getItem,
    setItem,
    setItemWithEncryption,
    getItemWithDecryption,
    clear,
    getAllItems: () => storage
  };
};

export default useLocalStorage;