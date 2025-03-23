'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Rating } from '@/lib/types';

ChartJS.register(ArcElement, Tooltip, Legend);

// Function to generate a color gradient between red and green based on rating
function getColorForRating(rating: number) {
  // Convert rating from 1-5 scale to 0-1 scale
  const normalized = (rating - 1) / 4;
  
  // Red to green gradient
  const r = Math.floor(255 * (1 - normalized));
  const g = Math.floor(255 * normalized);
  const b = 0;
  
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
}

interface RatingPieChartProps {
  ratings: Rating[];
  chartType: 'classType' | 'studioLocation';
  title: string;
}

export default function RatingPieChart({ ratings, chartType, title }: RatingPieChartProps) {
  // Group ratings by the given attribute (classType or studioLocation)
  const groupedRatings = ratings.reduce<Record<string, Rating[]>>((acc, rating) => {
    const key = rating[chartType];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(rating);
    return acc;
  }, {});

  // If no ratings, show empty message
  if (Object.keys(groupedRatings).length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Calculate average ratings for each group
  const labels = Object.keys(groupedRatings);
  const averageRatings = labels.map(key => {
    const groupRatings = groupedRatings[key];
    const sum = groupRatings.reduce((acc, rating) => acc + rating.overallRating, 0);
    return sum / groupRatings.length;
  });
  
  // Get counts for each group
  const counts = labels.map(key => groupedRatings[key].length);
  
  // Generate colors based on average ratings
  const backgroundColors = averageRatings.map(avg => getColorForRating(avg));
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Number of Classes',
        data: counts,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const avgRating = averageRatings[context.dataIndex].toFixed(1);
            return `${label}: ${value} classes (Avg: ${avgRating}★)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
      <div className="w-full h-60">
        <Pie data={data} options={options} />
      </div>
      <div className="mt-4 text-xs text-center">
        <div className="flex justify-center items-center">
          <span className="w-4 h-4 bg-red-500 inline-block mr-1 rounded-sm"></span>
          <span className="mr-3">Low Rating</span>
          <span className="w-4 h-4 bg-yellow-500 inline-block mr-1 rounded-sm"></span>
          <span className="mr-3">Medium Rating</span>
          <span className="w-4 h-4 bg-green-500 inline-block mr-1 rounded-sm"></span>
          <span>High Rating</span>
        </div>
      </div>
    </div>
  );
}