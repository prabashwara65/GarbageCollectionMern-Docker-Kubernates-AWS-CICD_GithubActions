import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2'; // Import Line from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

// Register chart components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const AreaDashboard = () => {
  const [users, setUsers] = useState([]); // State for storing users
  const navigate = useNavigate(); // Initialize useNavigate for page navigation

  useEffect(() => {
    // Fetch Users by Area
    axios.get('http://localhost:8000/register/ViewUsers')
      .then(res => {
        setUsers(res.data); // Update users state with the fetched data
      })
      .catch(err => console.log(err));
  }, []);

  // Calculate total users and collected users dynamically from the API data
  const calculateUserData = () => {
    if (users.length === 0) {
      return { allUsers: [], collectedUsers: [] }; // Return default values if no users are available
    }

    const areas = ["Area 1", "Area 2", "Area 3"];
    const allUsers = areas.map(area => users.filter(user => user.area === area).length);
    const collectedUsers = areas.map(area => users.filter(user => user.area === area && user.iscollected === 'collected').length);
    
    return { allUsers, collectedUsers };
  };

  const { allUsers, collectedUsers } = calculateUserData(); // Dynamic user counts

  // Chart data for line chart
  const data = {
    labels: ['Area 1', 'Area 2', 'Area 3'],
    datasets: [
      {
        label: 'All Users',
        data: allUsers,
        borderColor: '#166D8A',
        backgroundColor: 'rgba(22, 109, 138, 0.2)',
        fill: true, // Enable area filling
        tension: 0.4, // Smooth the line
      },
      {
        label: 'Collected Users',
        data: collectedUsers,
        borderColor: '#FF4359',
        backgroundColor: 'rgba(255, 67, 89, 0.2)',
        fill: true, // Enable area filling
        tension: 0.4, // Smooth the line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Count by Area',
        color: 'black',
        font: {
          family: 'Arial',
          size: 20,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: 'black',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: 'black',
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        navigate('/areaAssigntment');
      }
    },
  };

  return (
  
      <div className=" ">
        <div className="bg-white bg-opacity-20 shadow-lg rounded-lg h-80 p-3">
          <div className="w-full h-full hover:scale-105 transition-transform duration-300 ease-in-out">
            <Line data={data} options={options} /> {/* Use Line chart instead of Bar chart */}
          </div>
        </div>
      </div>

  );
};

export default AreaDashboard;
