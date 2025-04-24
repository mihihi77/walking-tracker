import React, { useEffect, useState } from 'react';
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

import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// Đăng ký các thành phần ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Activities = ({ userId }) => {
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    if (!userId) return;
  
    const q = query(collection(db, "users", userId, "activities"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const distanceMap = new Map(); // key: 'dd/mm/yyyy', value: totalDistance
  
      querySnapshot.forEach((doc) => {
        const d = doc.data();
        if (d.createdAt && typeof d.distance === 'number') {
          const date = d.createdAt.toDate();
          const dateKey = date.toLocaleDateString('en-GB'); // 'dd/mm/yyyy'
  
          const prev = distanceMap.get(dateKey) || 0;
          distanceMap.set(dateKey, prev + d.distance);
        }
      });
  
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
  
      // Convert to sorted array
      const aggregated = Array.from(distanceMap.entries())
        .map(([dateStr, total]) => {
          const [day, month, year] = dateStr.split('/');
          return {
            date: new Date(`${year}-${month}-${day}`),
            label: dateStr,
            distance: total
          };
        })
        .filter(entry => entry.date >= oneWeekAgo)
        .sort((a, b) => a.date - b.date);
  
      setActivityData(aggregated);
    });
  
    return () => unsubscribe();
  }, [userId]);

  if (activityData.length === 0) return null;

  const chartLabels = activityData.map(item => item.date.toLocaleDateString('en-GB')); // dd/mm/yyyy
  const distanceData = activityData.map(item => 
    item.distance != null ? parseFloat(item.distance.toFixed(2)) : 0
  );

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Distance (km)',
        data: distanceData,
        backgroundColor: 'rgba(29, 185, 84, 0.8)',
        borderColor: 'rgba(29, 185, 84, 0.8)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 0.5 },
        grid: { display: false }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} km`
        }
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
