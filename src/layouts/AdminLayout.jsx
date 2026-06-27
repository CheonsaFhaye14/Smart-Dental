import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Navbar receives a toggle handler so it can show the hamburger */}
      <AdminNavbar onMenuToggle={() => setSidebarOpen((o) => !o)} />

      {/* Sidebar receives open state for mobile drawer */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Backdrop for mobile — tap outside to close */}
      {sidebarOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="admin-content">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}