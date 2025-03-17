import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2'; 
import axios from 'axios';
import Drivers from '../DriverComponent/Drivers'; 
import Vehicles from '../VehicleComponents/Vehicles'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const CrudDisplay = () => {
  const [selectedCrud, setSelectedCrud] = useState('crud1');
  const [driverChartData, setDriverChartData] = useState(null);
  const [vehicleChartData, setVehicleChartData] = useState(null);

  const handleDropdownChange = (e) => {
    setSelectedCrud(e.target.value);
  };

  // Fetch drivers data and calculate available/unavailable stats
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/drivers/drivers');
        const drivers = response.data;

        // Calculate available and unavailable drivers
        const availableDrivers = drivers.filter(driver => driver.isAvailable === 'Available').length;
        const unavailableDrivers = drivers.filter(driver => driver.isAvailable === 'Unavailable').length;

        // Set chart data
        setDriverChartData({
          labels: ['Available', 'Unavailable'],
          datasets: [
            {
              label: 'Driver Availability',
              data: [availableDrivers, unavailableDrivers],
              backgroundColor: ['#22C55E', '#FF2C2C'], // Green for available, red for unavailable
              borderColor: ['#4CAF50', '#FF5252'],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error('Error fetching driver data:', err);
      }
    };

    fetchDriverData();
  }, []);

  // Fetch vehicles data and calculate available/unavailable stats
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/vehicles/vehicles');
        const vehicles = response.data;

        // Calculate available and unavailable vehicles
        const availableVehicles = vehicles.filter(vehicle => vehicle.isAvailable === 'Available').length;
        const unavailableVehicles = vehicles.filter(vehicle => vehicle.isAvailable === 'Unavailable').length;

        // Set chart data for vehicles
        setVehicleChartData({
          labels: ['Available', 'Unavailable'],
          datasets: [
            {
              label: 'Vehicle Availability',
              data: [availableVehicles, unavailableVehicles],
              backgroundColor: ['#22C55E', '#FF2C2C'], // Green for available, red for unavailable
              borderColor: ['#4CAF50', '#FF5252'],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error('Error fetching vehicle data:', err);
      }
    };

    fetchVehicleData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Charts Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-black">Driver Availability Chart</h2>
          <div className=" flex justify-center items-center h-60">
          {driverChartData ? (
              <Pie data={driverChartData} />
            ) : (
              <span className="text-gray-600">Loading chart...</span>
            )}
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-black">Vehicle Availability Chart</h2>
          <div className="flex justify-center items-center h-60">
            {vehicleChartData ? (
              <Pie data={vehicleChartData} />
            ) : (
              <span className="text-gray-600">Loading chart...</span>
            )}
          </div>
        </div>
      </div>

      {/* CRUD Container */}
      <div className="bg-white p-6 shadow-md rounded-lg text-black">
        <h2 className="text-xl font-bold mb-2"> All Drivers & Vehicles</h2>
        <div className="mb-4">
          <div className="flex justify-center">
            <select
              id="crud-select"
              value={selectedCrud}
              onChange={handleDropdownChange}
              className="p-2  border-gray-800 border-2 rounded w-25">
              <option value="crud1">Drivers Information</option>
              <option value="crud2">Refuse Truck Information</option>
            </select>
          </div>
        </div>

        {/* Conditionally Render CRUD 1 or CRUD 2 */}
        {selectedCrud === "crud1" && (
          <div>
            {/* Render the Drivers Component */}
            <Drivers />
          </div>
        )}

        {selectedCrud === "crud2" && (
          <div>
            {/* Render the Vehicles Component */}
            <Vehicles />
          </div>
        )}
      </div>
    </div>
  );
};

export default CrudDisplay;
