import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('currentUser');

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="BULLTECH Logo" className="logo-img" />
            <h1>BULLTECH</h1>
          </Link>
        </div>
        
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/plano" className={isActive('/plano') ? 'active' : ''}>
              Plano
            </Link>
          </li>
          <li>
            <Link to="/contato" className={isActive('/contato') ? 'active' : ''}>
              Contato
            </Link>
          </li>
          <li>
            <Link to="/sobre" className={isActive('/sobre') ? 'active' : ''}>
              Sobre Nós
            </Link>
          </li>
          {isLoggedIn ? (
            <li><button onClick={handleLogout} className="logout-btn">Sair</button></li>
          ) : (
            <li>
              <Link to="/login" className={isActive('/login') ? 'active' : ''}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;