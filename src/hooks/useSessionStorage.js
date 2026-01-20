import { useCallback, useState, useEffect } from "react";

const useSessionStorage = () => {
  const [storage, setStorage] = useState({});

  useEffect(() => {
    const syncStorage = () => {
      const newStorage = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        newStorage[key] = sessionStorage.getItem(key);
      }
      setStorage(newStorage);
    };

    syncStorage();
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  const removeItem = useCallback((key) => {
    sessionStorage.removeItem(key);
    setStorage((prev) => {
      const newStorage = { ...prev };
      delete newStorage[key];
      return newStorage;
    });
  }, []);

  const setItem = useCallback((key, value) => {
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : value;
    sessionStorage.setItem(key, stringValue);
    setStorage((prev) => ({ ...prev, [key]: stringValue }));

    window.dispatchEvent(new Event("storage"));
  }, []);

  const getItem = useCallback((key) => {
    const value = sessionStorage.getItem(key);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }, []);

  const clear = useCallback(() => {
    sessionStorage.clear();
    setStorage({});
    window.dispatchEvent(new Event("storage"));
  }, []);

  return {
    storage,
    removeItem,
    getItem,
    setItem,
    clear,
    getAllItems: () => storage,
  };
};

export default useSessionStorage;
