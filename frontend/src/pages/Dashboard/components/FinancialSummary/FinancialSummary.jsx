import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';
import './FinancialSummary.css';

const FinancialSummary = ({ financial = {} }) => {
  const {
    totalRevenue = 0,
    pendingRevenue = 0,
    overdueRevenue = 0,
    totalExpenses = 0,
    netProfit = 0
  } = financial;

  const items = [
    {
      label: 'Chiffre d\'affaires',
      value: totalRevenue,
      color: '#2563eb',
      icon: '💰'
    },
    {
      label: 'En attente',
      value: pendingRevenue,
      color: '#eab308',
      icon: '⏳'
    },
    {
      label: 'En retard',
      value: overdueRevenue,
      color: '#ef4444',
      icon: '⚠️'
    },
    {
      label: 'Dépenses',
      value: totalExpenses,
      color: '#8b5cf6',
      icon: '📊'
    },
    {
      label: 'Bénéfice net',
      value: netProfit,
      color: '#22c55e',
      icon: '📈'
    }
  ];

  return (
    <div className="financial-summary">
      {items.map((item, index) => (
        <div key={index} className="financial-item">
          <div className="financial-item-header">
            <span className="financial-item-icon">{item.icon}</span>
            <span className="financial-item-label">{item.label}</span>
          </div>
          <div
            className="financial-item-value"
            style={{ color: item.color }}
          >
            {formatCurrency(item.value)}
          </div>
          <div
            className="financial-item-bar"
            style={{
              width: '100%',
              height: '4px',
              background: item.color,
              borderRadius: '2px',
              opacity: 0.3
            }}
          >
            <div
              className="financial-item-bar-fill"
              style={{
                width: `${Math.min((item.value / (totalRevenue || 1)) * 100, 100)}%`,
                height: '100%',
                background: item.color,
                borderRadius: '2px',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinancialSummary;