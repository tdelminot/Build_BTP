import React from 'react';
import './Footer.css';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © {year} TIA INFO BUILD - Tous droits réservés
        </p>
        <p className="footer-version">Version 1.0.0</p>
      </div>
    </footer>
  );
};