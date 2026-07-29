import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './BarChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

export const BarChart = ({
  data,
  labels,
  title = '',
  xLabel = '',
  yLabel = '',
  height = 300,
  colors = ['#2563eb', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'],
  horizontal = false,
  stacked = false,
  className = ''
}) => {
  const chartData = {
    labels,
    datasets: Array.isArray(data) && data.length > 0 && typeof data[0] === 'object'
      ? data.map((dataset, index) => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || colors[index % colors.length],
          borderRadius: 4,
        }))
      : [
          {
            label: title || 'Données',
            data: data,
            backgroundColor: colors[0],
            borderRadius: 4,
          }
        ]
  };

  const options = {
    indexAxis: horizontal ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        title: {
          display: !!xLabel,
          text: xLabel,
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: {
          display: !!yLabel,
          text: yLabel,
          font: {
            weight: 'bold'
          }
        },
        stacked: stacked || false
      }
    }
  };

  return (
    <div className={`bar-chart ${className}`} style={{ height: `${height}px` }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};