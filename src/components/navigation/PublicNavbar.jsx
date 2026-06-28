import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import './PublicNavbar.css'; 
import logo from '../../assets/image.png'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function PublicNavbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`public-navbar ${menuOpen ? "active" : ""}`}>
      <div className="navbar-logo">
        <img src={logo} alt="Dental Clinic Logo" />
        <span>Smart Dental Clinic</span>
      </div>

      <div className="navbar-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/learn-more" className={location.pathname === "/learn-more" ? "active" : ""} onClick={() => setMenuOpen(false)}>Learn More</Link>
        <Link to="/downloadapp" className={location.pathname === "/downloadapp" ? "active" : ""} onClick={() => setMenuOpen(false)}>Download App</Link>
        <Link to="/login" className={`login-link ${location.pathname === "/login" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Admin Login</Link>
      </div>

      {/* ✅ Replace the div hamburger with a button */}
<button
  className="hamburger-menu"
  onClick={toggleMenu}
  aria-label="Toggle menu"
>
  <FontAwesomeIcon icon={faBars} />
</button>
    </nav>
  );
}
