// AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUsers, faBriefcase, faCalendar } from "@fortawesome/free-solid-svg-icons";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
        <div className="sidebar-header"></div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
          <span className="sidebar-text">Dashboard</span>
        </NavLink>

        <NavLink to="/users" className="sidebar-link">
          <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
          <span className="sidebar-text">Users</span>
        </NavLink>

        <NavLink to="/services" className="sidebar-link">
          <FontAwesomeIcon icon={faBriefcase} className="sidebar-icon" />
          <span className="sidebar-text">Services</span>
        </NavLink>

        <NavLink to="/appointments" className="sidebar-link">
          <FontAwesomeIcon icon={faCalendar} className="sidebar-icon" />
          <span className="sidebar-text">Appointments</span>
        </NavLink>
      </nav>
    </aside>
  );
}
