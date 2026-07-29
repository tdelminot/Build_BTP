import React from 'react';
import { Link, useLocation } from 'react-router-dom';
 
import './Sidebar.css';

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Tableau de bord' },
    { path: '/projects', icon: '📋', label: 'Projets' },
    { path: '/employees', icon: '👷', label: 'Employés' },
    { path: '/materials', icon: '📦', label: 'Matériels' },
    { path: '/invoices', icon: '💰', label: 'Factures' },
    { path: '/reports/global', icon: '📈', label: 'Rapports' },
    { path: '/clients', icon: '🤝', label: 'Clients' },
    { path: '/suppliers', icon: '🏭', label: 'Fournisseurs' },
    { path: '/settings/profile', icon: '⚙️', label: 'Paramètres' },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🏗️</span>
            <span className="logo-text">TIA BUILD</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${
                location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? 'active' : ''
              }`}
              onClick={onClose}
            >
              <span className="link-icon">{item.icon}</span>
              <span className="link-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-version">Version 1.0.0</div>
        </div>
      </aside>
    </>
  );
};