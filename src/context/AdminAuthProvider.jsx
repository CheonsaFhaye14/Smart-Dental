import React, { useState, useEffect, useCallback } from "react";
import { AdminAuthContext } from "./AdminAuthContext";

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));

  const login = useCallback((newToken) => {
    localStorage.setItem("adminToken", newToken);
    setToken(newToken);
  }, []);

  // ✅ useCallback so logout is stable — won't cause infinite re-renders
  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    setToken(null);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("adminToken");
      setToken(stored);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}