import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './PieChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({
  data,
  labels,
  title = '',
  colors = ['#2563eb', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'],
  height = 300,
  doughnut = false,
  className = ''
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        data: data,
        backgroundColor: colors.slice(0, data.length),
        borderColor: 'white',
        borderWidth: 2,
        hoverOffset: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 16,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: doughnut ? '60%' : '0%'
  };

  return (
    <div className={`pie-chart ${className}`} style={{ height: `${height}px` }}>
      {title && <h4 className="pie-chart-title">{title}</h4>}
      <Pie data={chartData} options={options} />
    </div>
  );
};