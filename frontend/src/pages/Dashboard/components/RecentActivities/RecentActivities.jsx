import React from 'react';
import { formatRelativeTime } from '../../../../utils/formatters';
import './RecentActivities.css';

const RecentActivities = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'project': '📋',
      'invoice': '💰',
      'expense': '💳',
      'employee': '👷',
      'material': '📦',
      'user': '👤',
      'task': '✅'
    };
    return icons[type] || '📌';
  };

  const getActivityColor = (type) => {
    const colors = {
      'project': '#2563eb',
      'invoice': '#22c55e',
      'expense': '#ef4444',
      'employee': '#8b5cf6',
      'material': '#eab308',
      'user': '#ec4899',
      'task': '#14b8a6'
    };
    return colors[type] || '#64748b';
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="recent-activities-empty">
        <p>Aucune activité récente</p>
      </div>
    );
  }

  return (
    <div className="recent-activities">
      {activities.map((activity, index) => (
        <div key={index} className="activity-item">
          <div
            className="activity-icon"
            style={{ background: getActivityColor(activity.type) }}
          >
            {getActivityIcon(activity.type)}
          </div>
          <div className="activity-content">
            <p className="activity-message">{activity.message}</p>
            <span className="activity-time">
              {formatRelativeTime(activity.date)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivities;