import React, { useContext } from 'react';
import Card from './Card';
import { FaUsers, FaTruckMoving } from "react-icons/fa";
import { GrDocumentTime } from "react-icons/gr";
import { IoPersonAddSharp } from "react-icons/io5";
import { dataLine, dataBar } from '../../assets/AdminDashboard/chartData';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { ThemeContext } from '../../context/AdminDashboard/ThemeContextProvider';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement);

const Home = () => {
  const { theme } = useContext(ThemeContext);

  // Chart options with dynamic colors based on theme
  const chartOptions = {
    scales: {
      x: {
        grid: {
          color: theme === 'dark' ? '#4B5563' : '#E5E7EB', // Gray color for the grid lines
        },
        ticks: {
          color: theme === 'dark' ? '#E5E7EB' : '#4B5563', // Light gray in dark mode, darker gray in light mode
        },
      },
      y: {
        grid: {
          color: theme === 'dark' ? '#4B5563' : '#E5E7EB', // Gray color for the grid lines
        },
        ticks: {
          color: theme === 'dark' ? '#E5E7EB' : '#4B5563', // Light gray in dark mode, darker gray in light mode
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#E5E7EB' : '#4B5563', // Light gray in dark mode, darker gray in light mode
        },
      },
    },
  };

  return (
    <div className='grow p-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        <Card icon={FaUsers} title="Users" value="150" />
        <Card icon={GrDocumentTime} title="Complaints" value="10" />
        <Card icon={FaTruckMoving} title="Waste Collection Vehicles" value="40" />
        <Card icon={IoPersonAddSharp} title="Drivers" value="30" />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <div className='bg-gray-200 p-4 dark:bg-gray-700 rounded-lg shadow-md'>
          <h3 className='text-lg font-semibold mb-4 dark:text-white'>Complaints Data</h3>
          <Line data={dataLine} options={chartOptions} />
        </div>

        <div className='bg-gray-200 p-4 rounded-lg shadow-md dark:bg-gray-700'>
          <h3 className='text-lg font-semibold mb-4 dark:text-white'>Users Data</h3>
          <Bar data={dataBar} options={chartOptions} />
        </div>
      </div>

      
    </div>
  );
}

export default Home;
