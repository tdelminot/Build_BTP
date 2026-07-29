import React from 'react';
import { formatCurrency, formatNumber } from '../../../../utils/formatters';
import './KPIWidget.css';

const KPIWidget = ({
  title,
  value,
  icon,
  color,
  format = 'number',
  change = null,
  className = ''
}) => {
  const formattedValue = format === 'currency' 
    ? formatCurrency(value) 
    : formatNumber(value);

  return (
    <div className={`kpi-widget ${className}`}>
      <div className="kpi-header">
        <span className="kpi-icon" style={{ background: color }}>
          {icon}
        </span>
        <span className="kpi-title">{title}</span>
      </div>
      <div className="kpi-value">{formattedValue}</div>
      {change !== null && (
        <div className={`kpi-change ${change >= 0 ? 'positive' : 'negative'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      )}
    </div>
  );
};

export default KPIWidget;