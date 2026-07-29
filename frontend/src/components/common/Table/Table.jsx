import React from 'react';
import './Table.css';

export const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'Aucune donnée disponible',
  onRowClick = null,
  className = '',
  ...props
}) => {
  const safeData = Array.isArray(data) ? data : [];
  
  if (loading) {
    return (
      <div className="table-loading">
        <div className="table-loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (safeData.length === 0) {
    return (
      <div className="table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className="table" {...props}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} style={{ width: col.width }} className={col.className}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {safeData.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'table-row-clickable' : ''}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};