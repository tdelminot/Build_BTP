import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './Navbar.css';

export const Navbar = ({ toggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">🏗️</span>
          <span className="brand-text">TIA BUILD</span>
        </Link>
      </div>

      <div className="navbar-right">
        {isAuthenticated && user ? (
          // Utilisateur connecté : Afficher le profil
          <div className="navbar-user">
            <button
              className="navbar-user-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="user-avatar">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
              <span className="user-name">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="user-chevron">▼</span>
            </button>

            {isDropdownOpen && (
              <div className="navbar-dropdown">
                <Link to="/settings/profile" className="dropdown-item">
                  👤 Profil
                </Link>
                <Link to="/settings/general" className="dropdown-item">
                  ⚙️ Paramètres
                </Link>
                <hr className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={handleLogout}>
                  🚪 Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          //  Utilisateur non connecté : Afficher le bouton Connexion
          <Link to="/login" className="navbar-login-btn">
            🔑 Connexion
          </Link>
        )}
      </div>
    </nav>
  );
};