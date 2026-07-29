import React from 'react';
import { PROJECT_STATUS } from '../../../../utils/constants';
import './ProjectStatus.css';

const ProjectStatus = ({ status = {} }) => {
  const statusConfig = {
    'PLANNING': { label: 'Planification', color: '#3b82f6', icon: '📋' },
    'IN_PROGRESS': { label: 'En cours', color: '#22c55e', icon: '⚡' },
    'ON_HOLD': { label: 'En pause', color: '#eab308', icon: '⏸️' },
    'COMPLETED': { label: 'Terminé', color: '#8b5cf6', icon: '✅' },
    'CANCELLED': { label: 'Annulé', color: '#ef4444', icon: '❌' }
  };

  const total = Object.values(status).reduce((sum, val) => sum + (val || 0), 0);

  if (total === 0) {
    return (
      <div className="project-status-empty">
        <p>Aucun projet</p>
      </div>
    );
  }

  return (
    <div className="project-status">
      {Object.entries(PROJECT_STATUS).map(([key, value]) => {
        const count = status[value] || 0;
        const config = statusConfig[key];
        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <div key={key} className="status-item">
            <div className="status-header">
              <span className="status-icon">{config.icon}</span>
              <span className="status-label">{config.label}</span>
              <span className="status-count">{count}</span>
            </div>
            <div className="status-bar">
              <div
                className="status-bar-fill"
                style={{
                  width: `${percentage}%`,
                  background: config.color
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectStatus;