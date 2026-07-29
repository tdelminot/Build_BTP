import React from 'react';
import { BarChart } from '../../../../components/charts/BarChart/BarChart';
import './ProjectChart.css';

const ProjectChart = ({ projects = [] }) => {
  const labels = projects.map(p => p.name || 'Sans nom');
  const data = projects.map(p => p.progress || 0);

  const colors = projects.map(p => {
    const progress = p.progress || 0;
    if (progress >= 80) return '#22c55e';
    if (progress >= 50) return '#eab308';
    if (progress >= 20) return '#f97316';
    return '#ef4444';
  });

  return (
    <div className="project-chart">
      <BarChart
        data={data}
        labels={labels}
        title="Avancement des projets"
        yLabel="Progression (%)"
        height={250}
        colors={colors}
      />
    </div>
  );
};

export default ProjectChart;