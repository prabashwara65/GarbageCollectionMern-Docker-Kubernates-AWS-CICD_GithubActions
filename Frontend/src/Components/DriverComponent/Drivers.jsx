import React, { useState , useEffect} from 'react'
import { Link } from 'react-router-dom';
import DashboardNavigationButton from '../VehicleComponents/DashboardNavigateButton';
import axios from 'axios';

function Drivers() {
    const[drivers, setDrivers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/drivers/drivers')
            .then(result => setDrivers(result.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete('http://localhost:4000/drivers/deleteDriver/' +id)
        .then(res => {console.log(res)
          window.location.reload()
        })
        .catch(err => console.log(err))
        }
  

  return (
    <div className='bg-gray-300 min-h-screen flex justify-center items-center w-full'>
        <DashboardNavigationButton/>
        <div className='bg-white rounded p-3 m-5 overflow-auto'>
        {/* <h1 className="text-2xl font-bold mb-4 text-center">Drivers Information</h1> */}
        <Link
                    to="/createDrivers"
                    className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-semibold text-sm rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Driver
                </Link>
                <div className="mt-4 max-h-[450px] overflow-y-auto">
            <table className="table mt-3">
                   <thead>
                    <tr className='p-5 border-b-2 border-gray-400'>
                       <th>Employee ID</th>
                       <th>Name</th>
                       <th className='whitespace-nowrap'>Date of Brith</th>
                       <th className='whitespace-nowrap'>Identy Card Number<br></br> (NIC)</th>
                       <th>Gender</th>
                       <th>Address</th>
                       <th>Phone Number</th>
                       <th>Email Address</th>
                       <th>License Requirements</th>
                       <th>Position</th>
                       <th className='whitespace-nowrap'>Date of Hire</th>
                       <th>Employeement Status</th>
                       <th>Availability</th>
                       <th>Action</th>
                    </tr>
                   </thead>
                   <tbody>
                          {
                            drivers.map((driver) =>{
                               return  <tr className='text-sm border-b-2 border-gray-400 p-5' key={driver._id}>
                                    <td>{driver.employeeId}</td>
                                    <td>
                                        <ol>
                                            <li><span className='font-semibold whitespace-nowrap'>First Name:</span><br></br>
                                                {driver.name.firstName}
                                            </li>
                                            <li><span className='font-semibold whitespace-nowrap'>Last Name:</span><br></br>
                                                {driver.name.lastName}
                                            </li>
                                        </ol>
                                    </td>
                                    <td>{driver.dateOfBirth}</td>
                                    <td>{driver.nic}</td>
                                    <td>{driver.gender}</td>
                                    <td>
                                        <ol>
                                            <li><span className='font-semibold whitespace-nowrap'>No:</span>
                                            {driver.address.no}
                                            </li>
                                            <li><span className='font-semibold whitespace-nowrap'>Street:</span><br></br>
                                            {driver.address.street}
                                            </li>
                                            <li><span className='font-semibold whitespace-nowrap'>City:</span>
                                            {driver.address.city}
                                            </li>
                                        </ol>
                                    </td>
                                    <td>{driver.phoneNumber}</td>
                                    <td>{driver.email}</td>
                                    <td>
                                        <ol>
                                            <li><span className='font-semibold whitespace-nowrap'>License Number:</span><br></br>
                                                {driver.licenseRequirements.licenseNumber}
                                            </li>
                                            <li><span className='font-semibold whitespace-nowrap'>License Expiry Date:</span><br></br>
                                                {driver.licenseRequirements.licenseExpiryDate}
                                            </li>
                                        </ol>
                                    </td>
                                    <td className='whitespace-nowrap'>{driver.position}</td>
                                    <td>{driver.hiredDate}</td>
                                    <td>{driver.status}</td>
                                    <td>{driver.isAvailable}</td>
                                    <td>
                                    <div className="flex space-x-2">
                                    <Link to={`/updateDrivers/${driver._id}`} className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-semibold text-sm rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 mr-2">
                                         <path strokeLinecap="round" strokeLinejoin="round" d="M15.682 5.318a1.5 1.5 0 00-2.121 0l-9.192 9.193a1.5 1.5 0 00-.376.55l-2.033 5.381a.75.75 0 00.908.908l5.38-2.033a1.5 1.5 0 00.548-.377l9.192-9.192a1.5 1.5 0 000-2.121l-3.03-3.031zM13.5 
                                          7.5L16.5 10.5l3-3-3-3-3 3zM18 12l-1.5 1.5L12 9l1.5-1.5L18 12z" /> </svg>
                                               Edit Details
                                    </Link>
                                    <button onClick={(e) => handleDelete(driver._id)} className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-semibold text-sm rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2">
                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mr-2">
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                               Delete Details
                                      </button>

                                    </div>
                                    </td>
                                </tr>
                            })
                          }
                   </tbody>
            </table>
        </div>
    </div>
    </div>
  )
}

export default Drivers

