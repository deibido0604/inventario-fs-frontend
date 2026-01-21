export default function useSessionStorage() {
  const removeItem = (key) => window.sessionStorage.removeItem(key);

  const setItem = (key, value) => {
    sessionStorage.setItem(key, value);
  };

  const getItem = (key) => {
    const value = sessionStorage.getItem(key);
    if (!value) return null;

    return value;
  };

  return {
    removeItem,
    getItem,
    setItem,
  };
}
