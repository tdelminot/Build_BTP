import React, { useState } from 'react';
import './Alert.css';

export const Alert = ({
  type = 'info',
  message,
  title,
  onClose,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const classes = [
    'alert',
    `alert-${type}`,
    className
  ].filter(Boolean).join(' ');

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={classes} {...props}>
      <div className="alert-icon">{icons[type]}</div>
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-message">{message}</div>
      </div>
      {onClose && (
        <button className="alert-close" onClick={handleClose}>
          ×
        </button>
      )}
    </div>
  );
};