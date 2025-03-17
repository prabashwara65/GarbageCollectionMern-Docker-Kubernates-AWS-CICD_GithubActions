import React, { useContext } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../../context/AdminDashboard/ThemeContextProvider';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`bg-gray-100 text-gray-900 border-b border-gray-300 p-2 flex items-center font-bold text-xl font-serif justify-between dark:border-gray-600 dark:bg-gray-900 dark:text-white`}>
      <h1>Dashboard</h1>

      <div className="relative">
        <button
          onClick={toggleTheme}
          className="w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center p-1 transition-colors duration-300"
        >
          <div
            className={`h-6 w-6 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-8' : ''}`}
          >
            {theme === 'light' ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;

