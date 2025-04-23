import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Activities = () => {
  // Dữ liệu biểu đồ
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Last Week Burned Calories',
        data: [1200, 1300, 1250, 1100, 1400, 1350, 1450],
        backgroundColor: 'rgba(29, 185, 84, 0.8)',  // #0d47a1 + độ mờ
        borderColor: 'rgba(29, 185, 84, 0.8)',        // #0d47a1 full màu
        borderWidth: 1
      }
    ]
  };

  // Tùy chỉnh biểu đồ
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false // Tắt grid trục X
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 250
        },
        grid: {
          display: false // Tắt grid trục Y
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-lg w-full md:w-2/3 mx-auto" style={{ backgroundColor: '#121212' }}>
      <div className="h-48 w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Activities;
