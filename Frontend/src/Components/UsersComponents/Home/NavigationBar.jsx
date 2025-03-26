import { React, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearUser } from '../../ReduxTool/userSlice';
import { twMerge } from "tailwind-merge";
import PropTypes from "prop-types";

const NavigationBar = ({ className }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get('http://localhost:4000/logout')
      .then(res => {
        if (res.data.Status) {
          dispatch(clearUser());
          navigate('/login');
        }
      })
      .catch(err => {
        console.error('Logout failed:', err);
      });
  };

  useEffect(() => {
    console.log(user.loggedIn);
  }, [user]);


  NavigationBar.PropTypes = {
    className: PropTypes.string,
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className={twMerge("bg-transparent", className)}>
        <div className="navbar container mx-auto">
          <div className="navbar-start">
            <a href="#" className="hover:text-blue-600 transition-colors duration-200">
              Garbage Collection
            </a>
          </div>
          <ul className="flex space-x-6 text-white-700 font-semibold !text-center">
            <li>
              <a href="#home" className="hover:text-blue-600 transition-colors duration-200">
                Home
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-blue-600 transition-colors duration-200">
                ChatBot
              </a>
            </li>
            <li>
              <a href="/UserProfileDashboard" className="hover:text-blue-600 transition-colors duration-200">
                UsersProfile
              </a>
            </li>
            <li>
              <a href="/map" className="hover:text-blue-600 transition-colors duration-200">
                Map
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-600 transition-colors duration-200">
                Contact
              </a>
            </li>
            {user.loggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-orange-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <a
                  href="/login"
                  className="bg-orange-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-orange-600 transition-colors duration-200"
                >
                  Login
                </a>
              </li>
            )}
          </ul>
        </div>
      </nav>

     </div>
  );
};

export default NavigationBar;
