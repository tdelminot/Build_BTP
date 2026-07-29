import React from 'react';
import './GanttChart.css';

export const GanttChart = ({
  tasks = [],
  startDate,
  endDate,
  height = 400,
  className = ''
}) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="gantt-empty">
        <p>Aucune tâche à afficher</p>
      </div>
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  const getPosition = (taskStart, taskEnd) => {
    const taskStartDate = new Date(taskStart);
    const taskEndDate = new Date(taskEnd);
    const startOffset = Math.ceil((taskStartDate - start) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((taskEndDate - taskStartDate) / (1000 * 60 * 60 * 24)) || 1;
    return {
      left: (startOffset / totalDays) * 100,
      width: (duration / totalDays) * 100
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      'TODO': '#94a3b8',
      'IN_PROGRESS': '#3b82f6',
      'COMPLETED': '#22c55e',
      'BLOCKED': '#ef4444'
    };
    return colors[status] || '#94a3b8';
  };

  const getDays = () => {
    const days = [];
    for (let i = 0; i <= totalDays; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  return (
    <div className={`gantt-chart ${className}`} style={{ height: `${height}px` }}>
      <div className="gantt-header">
        <div className="gantt-task-label">Tâche</div>
        <div className="gantt-timeline">
          {getDays().map((date, index) => (
            <div key={index} className="gantt-day">
              <span className="gantt-day-label">
                {date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="gantt-body">
        {tasks.map((task, index) => {
          const { left, width } = getPosition(task.startDate, task.dueDate);
          return (
            <div key={index} className="gantt-row">
              <div className="gantt-task-label">
                <span className="gantt-task-name">{task.title}</span>
              </div>
              <div className="gantt-timeline">
                <div
                  className="gantt-bar"
                  style={{
                    left: `${left}%`,
                    width: `${Math.max(width, 2)}%`,
                    backgroundColor: getStatusColor(task.status)
                  }}
                  title={`${task.title} (${task.status})`}
                >
                  <span className="gantt-bar-label">{task.title}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};