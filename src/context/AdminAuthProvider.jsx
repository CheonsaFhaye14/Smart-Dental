import React, { useState, useEffect } from "react";
import { AdminAuthContext } from "./AdminAuthContext";

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  const login = (newToken) => {
    localStorage.setItem("adminToken", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem("adminToken");
    if (stored) setToken(stored);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
