import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardNavigationButton from './DashboardNavigateButton'

function Vehicles() {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/vehicles/vehicles')
            .then(result => setVehicles(result.data))
            .catch(err => console.log(err));
    }, []);
   
    const handleDelete = (id) => {
      axios.delete('http://localhost:8000/vehicles/deleteVehicle/' +id)
      .then(res => {console.log(res)
        window.location.reload()
      })
      .catch(err => console.log(err))
      }

    return (
        <div className="flex min-h-screen bg-gray-300 justify-center items-center w-full">
            <DashboardNavigationButton/>
            <div className="bg-white rounded p-5 mr-5 ml-5 mt-10 mb-5 overflow-auto">
            {/* <h1 className="text-2xl font-bold mb-4 text-center">Refuse Trucks Information</h1> */}
                <Link
                    to="/createVehicles"
                    className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-semibold text-sm rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Vehicle
                </Link>
            
            <div className="mt-4 max-h-[450px] overflow-y-auto">
                <table className="table w-full">
                    <thead>
                        <tr className='border-b-2 border-gray-400'>
                            <th>Vehicle ID</th>
                            <th>Number Plate</th>
                            <th>Registered Date</th>
                            <th>Type</th>
                            <th>Capacity<br></br>(Cubic Yards)</th>
                            <th>Suitable Environment</th>
                            <th>Fuel Type</th>
                            <th>Fuel Capacity</th>
                            <th>Insurance Requirement</th>
                            <th>Emissions Standards</th>
                            <th>Maintenance Records</th>
                            <th>Availability</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            vehicles.map((vehicle) => {
                                const insuranceRequirement = vehicle.insuranceRequirement || {};
                                return (
                                    <tr className="text-sm border-b-2 border-gray-400 p-5" key={vehicle._id}>
                                        <td className="w-25">{vehicle.vehicleId}</td>
                                        <td className="w-25">{vehicle.vehicleNumber}</td>
                                        <td className="w-0">{vehicle.date}</td>
                                        <td>{vehicle.vehicleType}</td>
                                        <td>{vehicle.capacity}</td>
                                        <td>{vehicle.environment}</td>
                                        <td>{vehicle.fuelType}</td>
                                        <td className="w-40">{vehicle.fuelCapacity}</td>
                                        <td className="w-100">
                                            <ul className="list-disc list-inside">
                                                <li><span className="font-semibold text-sm">Start Date:</span>
                                                    {insuranceRequirement.insuranceStartDate ? new Date(insuranceRequirement.insuranceStartDate).toLocaleDateString() : 'N/A'}
                                                </li>
                                                <li><span className="font-semibold text-sm">Expiry Date:</span>
                                                    {insuranceRequirement.insuranceExpiryDate ? new Date(insuranceRequirement.insuranceExpiryDate).toLocaleDateString() : 'N/A'}
                                                </li>
                                                <li><span className="font-semibold text-sm">Type:</span>
                                                    {insuranceRequirement.insuranceType || 'N/A'}
                                                </li>
                                            </ul>
                                        </td>
                                        <td>{vehicle.emissionStandard}</td>
                                        <td>{vehicle.maintenance}</td>
                                        <td>{vehicle.isAvailable}</td>
                                        <td>
                                            <div className="flex space-x-2">
                                                <Link to={`/updateVehicles/${vehicle._id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">
                                                    Edit
                                                </Link>
                                                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                                                 onClick={(e) => handleDelete(vehicle._id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
       </div> 
    );

}

export default Vehicles;
