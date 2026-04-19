import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/feedback" className="navbar-brand">
        <div className="navbar-logo">EF</div>
        <span className="navbar-title">EduFeedback</span>
      </NavLink>

      <div className="navbar-links">
        <NavLink
          to="/feedback"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          📝 Submit Feedback
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          📊 Admin Dashboard
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
