import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
        <AdminNavbar />
      <AdminSidebar />
      
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
