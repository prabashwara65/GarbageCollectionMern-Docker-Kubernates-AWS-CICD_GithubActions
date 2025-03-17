import React, { useState } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import UsersDashboard from '../UsersComponents/UsersDashboard/UsersDashboard';
import ThemeContextProvider from '../../context/AdminDashboard/ThemeContextProvider';
import AreaDashboard from '../Area&Users/AreaDashboard'
// import VehicleDashboard from '../VehicleComponents/Vehicles'
// import DriverDashboard from '../DriverComponent/Drivers'
import { MdDashboard } from "react-icons/md";
import { FaUsers, FaChartArea, FaTruckMoving } from "react-icons/fa";
import { GrDocumentTime } from "react-icons/gr";
import { IoPersonAddSharp, IoSettingsSharp } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";
import { Link } from "react-router-dom";
import ComplaintsDashboard from '../ComplaintsComponent/ComplaintsDashboard';
import AssigntmentDashboard from '../Area&Users/AreaAssignment';
import ReportDashboard from '../Reports/reportDashboard'
import SendMessage from '../UsersComponents/EmailAndSms/SendConfirm'
import CrudDashboard from '../VehicleComponents/crudDisplay'


function Dashboard() {
  const [activePage, setActivePage] = useState('home');

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'users':
        return <UsersDashboard />;
      case 'sendMessage':
        return <SendMessage/>;
      case 'areaAssigntment':
        return <AssigntmentDashboard/>;
      case 'complaints' :
        return <ComplaintsDashboard/>
      // case 'drivers':
      //   return <DriverDashboard/>;
      // case 'vehicles':
      //   return <VehicleDashboard/>;
      case 'driversAndVehicles':
          return <CrudDashboard/>;
      case 'reports':
        return <ReportDashboard/>;
      default:
        return <Home />;
    }
  };

  const linkClass = (page) => 
   `flex items-center py-2 px-3 mt-3 space-x-4 hover:rounded cursor-pointer ${activePage === page ? 'bg-pastel-green text-white dark:bg-dark-green dark:text-black' : 'hover:bg-pastel-green dark:hover:bg-dark-green hover:text-white dark:hover:text-black'}`;



  return (
    <ThemeContextProvider>
      <div className='flex'>
        {/* Sidebar */}
        <div className="bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white h-screen fixed w-16 md:w-64 border-r border-gray-300 dark:border-gray-600">
          <div className="text-center py-4 font-serif">
            <h1 className="text-xl font-bold hidden md:block">Garbage Collection</h1>
            <h1 className="text-xl font-bold hidden md:block">Management</h1>
          </div>

          <ul className="flex flex-col mt-4 text-l font-serif">
            <li className={linkClass('home')} onClick={() => setActivePage('home')}>
              <Link to="/adminDashboard" className="flex items-center space-x-4">
                <MdDashboard className="text-2xl" />
                <span className="hidden md:inline font-bold text-center">Dashboard</span>
              </Link>
            </li>

            <li className={linkClass('users')} onClick={() => setActivePage('users')}>
              <FaUsers className="text-2xl" />
              <span className="hidden md:inline font-bold text-center">Users</span>
            </li>

            <li className={linkClass('sendMessage')} onClick={() => setActivePage('sendMessage')}>
              <FaChartArea className="text-2xl" />
              <span className="hidden md:inline font-bold">Send Message</span>
            </li>

            <li className={linkClass('areaAssigntment')} onClick={() => setActivePage('areaAssigntment')}>
              <FaChartArea className="text-2xl" />
              <span className="hidden md:inline font-bold">Area Assignment</span>
            </li>

            <li className={linkClass('complaints')} onClick={() => setActivePage('complaints')}>
              <GrDocumentTime className="text-2xl" />
              <span className="hidden md:inline font-bold">Complaints</span>
            </li>

            {/* <li className={linkClass('drivers')} onClick={() => setActivePage('drivers')}>
              <IoPersonAddSharp className="text-2xl" />
              <span className="hidden md:inline font-bold text-center">Drivers</span>
            </li>

            <li className={linkClass('vehicles')} onClick={() => setActivePage('vehicles')}>
                <FaTruckMoving className="text-2xl" />
                <span className="hidden md:inline font-bold">Refuse Trucks</span>
            </li> */}

            <li className={linkClass('driversAndVehicles')} onClick={() => setActivePage('driversAndVehicles')}>
                <FaTruckMoving className="text-2xl" />
                <span className="hidden md:inline font-bold">Drivers And Refuse Trucks</span>
            </li>

            <li className={linkClass('reports')} onClick={() => setActivePage('reports')}>
              <BiSolidReport className="text-2xl" />
              <span className="hidden md:inline font-bold text-center">Reports</span>
            </li>

            <li className={linkClass('settings')}>
              <IoSettingsSharp className="text-2xl" />
              <span className="hidden md:inline font-bold text-center">Settings</span>
            </li>
          </ul>
        </div>
        
        {/* Content Area */}
        <div className='ml-16 md:ml-64 h-screen w-full overflow-hidden bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white'>
          <Navbar />

          <div className='h-[calc(100vh-64px)] w-full overflow-y-auto py-2 dark:bg-gray-900 dark:text-white'>
            {renderContent()}
          </div>
        </div>
      </div>
    </ThemeContextProvider>
  );
}

export default Dashboard;
