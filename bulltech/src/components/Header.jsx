import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Importando a logo
import './Header.css';

const Header = ({ userName, userTitle }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-header">
      <div className="dashboard-header-content">
        <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="BULLTECH Logo" className="logo-img" />
          <div className="logo-text">
            <span>Soluções inteligentes para gestão pecuária</span>
          </div>
        </div>
        <div className="user-info">
          <h2>{userName}</h2>
          <p>{userTitle || "Msc. Veterinário"}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;