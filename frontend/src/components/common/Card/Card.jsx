import React from 'react';
import './Card.css';

export const Card = ({
  children,
  title,
  subtitle,
  headerActions = null,
  className = '',
  variant = 'default',
  ...props
}) => {
  const classes = [
    'card',
    `card-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {(title || subtitle || headerActions) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerActions && (
            <div className="card-header-actions">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};