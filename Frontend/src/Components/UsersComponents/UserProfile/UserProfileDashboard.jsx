import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../../ReduxTool/userSlice';
import EditProfile from './EditProfile'; // Import your EditProfile component
import Complaints from './Complaints'; // Placeholder for Complaints component
import GarbageEntries from './GarbageEntries'; // Placeholder for GarbageEntries component
import ChatBot from '../../chatbot/chatBot';

const UserProfileDashboard = () => {
  const { name } = useSelector((state) => state.user.user); // Removed email
  const dispatch = useDispatch();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('complaints'); // default section

  useEffect(() => {
    // Fetch all users from the API
    axios.get('http://localhost:8000/register/ViewUsers')
      .then(res => {
        const user = res.data.find(user => user.name === name);
        if (user) {
          setCurrentUser(user);
        }
      })
      .catch(err => console.log(err));
  }, [name]);

  const handleSignOut = () => {
    // Clear user data from Redux or local storage
    dispatch(setUser(null));
    // Optionally redirect to login or home page
    window.location.href = '/login'; // Example redirect to login page
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'editProfile':
        return <EditProfile />;
      case 'complaints':
        return <Complaints />;
      case 'garbageEntries':
        return <GarbageEntries />;
      default:
        return <EditProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="w-full bg-blue-500 text-white py-4 px-6 flex justify-between items-center shadow-md fixed top-0 left-0 right-0 z-10">
        <div></div> {/* Empty div for spacing */}
        <div className="flex items-center space-x-4 ml-auto"> {/* Added ml-auto to push content to the right */}
          <h1 className="text-xl font-bold">{name}</h1>
          <button
            onClick={handleSignOut}
            className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex pt-16"> {/* Padding added to account for fixed top bar */}
        {/* Sidebar */}
        <div className="w-64 bg-slate-500 shadow-lg p-6 flex flex-col justify-between z-20 fixed left-0 top-0 bottom-0">
          <nav className="mt-20">
            <ul className="space-y-4">
              {/* Text Above Complaint Tab */}
              <li className="text-white text-lg font-semibold mb-2">Your Actions</li>
              
              <li>
                <button
                  onClick={() => setActiveSection('complaints')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeSection === 'complaints' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Complaints
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('garbageEntries')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeSection === 'garbageEntries' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Garbage Entries
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('editProfile')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeSection === 'editProfile' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Edit Profile
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 ml-64"> {/* Account for sidebar width */}
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default UserProfileDashboard;
