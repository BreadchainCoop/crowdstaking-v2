// Custom hook to use localStorage safely with server side rendering
function useLocalStorage<T>() {
  const setLocalStorage = (key: string, value: T) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  const getLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      return storedValue !== null ? JSON.parse(storedValue) : "";
    }
    return "";
  };

  return [setLocalStorage, getLocalStorage] as const;
}

export default useLocalStorage;
