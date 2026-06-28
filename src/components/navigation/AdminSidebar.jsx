// AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUsers, faBriefcase, faCalendar } from "@fortawesome/free-solid-svg-icons";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
          <span className="sidebar-text">Dashboard</span>
        </NavLink>

        <hr className="sidebar-divider" />

        <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
          <span className="sidebar-text">Users</span>
        </NavLink>

        <hr className="sidebar-divider" />

        <NavLink to="/services" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <FontAwesomeIcon icon={faBriefcase} className="sidebar-icon" />
          <span className="sidebar-text">Services</span>
        </NavLink>

        <hr className="sidebar-divider" />

        <NavLink to="/appointments" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <FontAwesomeIcon icon={faCalendar} className="sidebar-icon" />
          <span className="sidebar-text">Appointments</span>
        </NavLink>
      </nav>

    <div className="sidebar-footer">
  <span className="sidebar-footer-icon">©</span>
  <span className="sidebar-footer-text">2026 Smart Dental Clinic</span>
</div>
    </aside>
  );
}