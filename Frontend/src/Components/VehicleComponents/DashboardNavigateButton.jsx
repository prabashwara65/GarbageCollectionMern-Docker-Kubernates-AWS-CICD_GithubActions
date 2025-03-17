import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NavigateButton = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/adminDashboard'); 
  };

  return (
<button 
  onClick={handleNavigation} 
  className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full 
             hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 
             focus:ring-opacity-75 transform transition-all duration-300 hover:scale-110 shadow-lg">
  <FaArrowLeft className="text-xl" />
</button>
  );
};

export default NavigateButton;