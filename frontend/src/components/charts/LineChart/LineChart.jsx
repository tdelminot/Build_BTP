import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './LineChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const LineChart = ({
  data,
  labels,
  title = '',
  xLabel = '',
  yLabel = '',
  height = 300,
  colors = ['#2563eb', '#22c55e', '#eab308', '#ef4444'],
  fill = false,
  tension = 0.3,
  className = ''
}) => {
  const chartData = {
    labels,
    datasets: Array.isArray(data) && data.length > 0 && typeof data[0] === 'object'
      ? data.map((dataset, index) => ({
          ...dataset,
          borderColor: dataset.borderColor || colors[index % colors.length],
          backgroundColor: dataset.backgroundColor || colors[index % colors.length] + '20',
          fill: dataset.fill !== undefined ? dataset.fill : fill,
          tension: dataset.tension || tension,
          pointRadius: 4,
          pointBackgroundColor: dataset.borderColor || colors[index % colors.length],
          borderWidth: 2,
        }))
      : [
          {
            label: title || 'Données',
            data: data,
            borderColor: colors[0],
            backgroundColor: colors[0] + '20',
            fill,
            tension,
            pointRadius: 4,
            pointBackgroundColor: colors[0],
            borderWidth: 2,
          }
        ]
  };

  const options = {
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
        }
      }
    }
  };

  return (
    <div className={`line-chart ${className}`} style={{ height: `${height}px` }}>
      <Line data={chartData} options={options} />
    </div>
  );
};