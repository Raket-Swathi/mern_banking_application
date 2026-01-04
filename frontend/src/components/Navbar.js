import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="nav-left">
        <div className="nav-title">Banking Application</div>
      </div>
      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        {!token && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
        {token && (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;