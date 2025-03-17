import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import NavigateButton from './NavigateButton';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const vehicleCapacities = {
  "Tracktor": "2-10",
  "Compactor Truck": "10-15",
  "Smaller Front-Loader": "20-25",
  "Larger Front-Loader": "30-40",
  "Small Rear Loader": "6-10",
  "Medium Rear Loader": "11-20",
  "Large Rear Loader": "21-32",
  "Light-Duty Roll-Off": "10-15",
  "Medium-Duty Roll-Off": "20-30",
  "Heavy-Duty Roll-Off": "40-50",
  "Side Loader": "28"
};


const suitableEnvironments = {
  "Tracktor": "Agricultural fields, construction sites",
  "Compactor Truck": "Urban areas, large commercial sites",
  "Smaller Front-Loader": "Residential areas, small commercial sites",
  "Larger Front-Loader": "Large commercial sites, industrial areas",
  "Small Rear Loader": "Residential areas, small parks",
  "Medium Rear Loader": "Commercial areas, small industrial areas",
  "Large Rear Loader": "Large industrial areas, urban waste management",
  "Light-Duty Roll-Off": "Residential renovations, small construction sites",
  "Medium-Duty Roll-Off": "Construction sites, large residential cleanups",
  "Heavy-Duty Roll-Off": "Large industrial sites, major construction projects",
  "Side Loader": "Urban areas, large residential complexes"
};


const fuelCapacities = {
  "Tracktor": {
    "Diesel": "150-200 liters",
    "Electric": "100-150 kWh",
    "CNG": "120-170 liters"
  },
  "Compactor Truck": {
    "Diesel": "300-400 liters",
    "Electric": "200-300 kWh",
    "CNG": "250-350 liters"
  },
  "Smaller Front-Loader": {
    "Diesel": "200-250 liters",
    "Electric": "150-200 kWh",
    "CNG": "180-230 liters"
  },
  "Larger Front-Loader": {
    "Diesel": "350-450 liters",
    "Electric": "250-350 kWh",
    "CNG": "300-400 liters"
  },
  "Small Rear Loader": {
    "Diesel": "150-200 liters",
    "Electric": "100-150 kWh",
    "CNG": "130-180 liters"
  },
  "Medium Rear Loader": {
    "Diesel": "250-350 liters",
    "Electric": "200-250 kWh",
    "CNG": "220-300 liters"
  },
  "Large Rear Loader": {
    "Diesel": "400-500 liters",
    "Electric": "300-400 kWh",
    "CNG": "350-450 liters"
  },
  "Light-Duty Roll-Off": {
    "Diesel": "150-200 liters",
    "Electric": "100-150 kWh",
    "CNG": "120-170 liters"
  },
  "Medium-Duty Roll-Off": {
    "Diesel": "250-350 liters",
    "Electric": "200-250 kWh",
    "CNG": "220-300 liters"
  },
  "Heavy-Duty Roll-Off": {
    "Diesel": "400-600 liters",
    "Electric": "350-450 kWh",
    "CNG": "450-550 liters"
  },
  "Side Loader": {
    "Diesel": "300-400 liters",
    "Electric": "250-350 kWh",
    "CNG": "350-450 liters"
  }
};



function UpdateVehicles() {
   
  const {id} = useParams()

  const [vehicleId, setVehicleId] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [environment, setEnvironment] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [fuelCapacity, setFuelCapacity] = useState("");
  const [emissionStandard, setEmissionStandard] = useState("");
  const [maintenance, SetMaintenance] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [insuranceRequirement, setInsuranceRequirement] = useState({
    insuranceStartDate:"",
    insuranceExpiryDate:"",
    insuranceType:""
  });
  const navigate = useNavigate();

  
  useEffect(() => {
    axios.get('http://localhost:8000/vehicles/getVehicle/' + id)
      .then(result => {
        const vehicleData = result.data;
  
        // Check if insuranceRequirement exists
        const insuranceReq = vehicleData.insuranceRequirement || {};
  
        setVehicleId(vehicleData.vehicleId);
        setVehicleNumber(vehicleData.vehicleNumber);
        setVehicleType(vehicleData.vehicleType);
        setCapacity(vehicleData.capacity);
        setEnvironment(vehicleData.environment);
        setFuelType(vehicleData.fuelType);
        setFuelCapacity(vehicleData.fuelCapacity);
        setEmissionStandard(vehicleData.emissionStandard);
        SetMaintenance(vehicleData.maintenance);
        setIsAvailable(vehicleData.isAvailable);
  
        // Set insuranceRequirement if data is available
        setInsuranceRequirement({
          insuranceStartDate: formatDate(insuranceReq.insuranceStartDate),
          insuranceExpiryDate: formatDate(insuranceReq.insuranceExpiryDate),
          insuranceType: insuranceReq.insuranceType || ""
        });
      })
      .catch(err => console.log(err));
  }, [id]);
  
  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
 
  const handleInsuranceChange = (e) => {
    setInsuranceRequirement((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleInsuranceExpiryDateChange = (e) => {
    setInsuranceRequirement(prev => ({
      ...prev,
      insuranceExpiryDate: e.target.value
    }));
  };

  const handleToggle = () => {
    setIsAvailable(!isAvailable);
  };

  const handleVehicleTypeChange = (event) => {
    const selectedType = event.target.value;
    setVehicleType(selectedType);
    setCapacity(vehicleCapacities[selectedType] || "");
    setEnvironment(suitableEnvironments[selectedType] || "");
    updateFuelCapacity(selectedType, fuelType);
  };

  const handleFuelTypeChange = (event) => {
    const selectedFuel = event.target.value;
    setFuelType(selectedFuel);
    updateFuelCapacity(vehicleType, selectedFuel);
  };

  const updateFuelCapacity = (vehicleType, fuelType) => {
    if (fuelCapacities[vehicleType] && fuelCapacities[vehicleType][fuelType]) {
      setFuelCapacity(fuelCapacities[vehicleType][fuelType]);
    } else {
      setFuelCapacity("");
    }
  };

  const handleRadioChange = (event) => {
    setEmissionStandard(event.target.value);
  };


  useEffect(() => {
    if (emissionStandard === "Fail" || (insuranceRequirement.insuranceExpiryDate && new Date(insuranceRequirement.insuranceExpiryDate) < new Date())) {
      setIsAvailable(false);
    }
  }, [emissionStandard, insuranceRequirement.insuranceExpiryDate]);

  const Update = (e) => {
  e.preventDefault();
  const availabilityStatus = isAvailable ? "Available" : "Unavailable";

  
    
    axios.put("http://localhost:8000/vehicles/updateVehicle/" + id, {
      vehicleId, vehicleNumber, vehicleType, capacity, environment, fuelType, fuelCapacity,
      insuranceRequirement: {
        insuranceStartDate: (insuranceRequirement.insuranceStartDate),
          insuranceExpiryDate:(insuranceRequirement.insuranceExpiryDate),
          insuranceType: insuranceRequirement.insuranceType
      },emissionStandard, maintenance, isAvailable: availabilityStatus
    })

    // vehicleId, vehicleNumber, date, vehicleType, capacity, environment, fuelType, fuelCapacity,insuranceRequirement: {
    //   insuranceStartDate:(insuranceRequirement.insuranceStartDate),
    //   insuranceExpiryDate: (insuranceRequirement.insuranceExpiryDate),
    //   insuranceType: insuranceRequirement.insuranceType,
    // },

    .then(() => {
      alert('Vehicle updated successfully!');
      navigate('/vehicles');
    })
    .catch(err => {
      console.error("Update failed:", err);
      alert('Failed to update vehicle. Please try again.');
    });
  
  
  }


  return (
    <div className="flex h-100 bg-green-200 justify-center items-center">
      <NavigateButton />
      <div className="w-75 bg-white rounded-lg p-6 shadow-lg mt-5 mb-5 ">
        <form onSubmit={Update}>
          <h1 className="text-2xl font-bold text-black mb-3">Update Vehicle Details</h1>
        
        
          <h3 className="text-l font-bold text-black mb-2">Identification</h3>
          
            <div>
              <label htmlFor="vehicleId" className="block text-gray-900 font-medium mb-1 mt-2">Vehicle ID</label>
              <input type="text" id="vehicleId" value={vehicleId} readOnly className="w-25 p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-600" 
              onChange={(e) => setVehicleId(e.target.value)} required/>
            </div>

            <div>
              <label htmlFor="numberPlate" className="block text-gray-900 font-medium mb-1 mt-3">Registration Plate (Number Plate)</label>
              <input type="text" id="numberPlate"value={vehicleNumber}  placeholder="Enter Vehicle Registration Number" className="w-25 p-2 border-1 border-gray-400 rounded-lg text-sm placeholder-gray-600 text-gray-600" 
              onChange={(e) => setVehicleNumber(e.target.value)} required />
            </div>
          
          <hr className="border-t-4 border-black my-4" />
          <h3 className="text-l text-black font-bold mb-2 mt-4">Type and Specification</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="vehicleType" className="block text-gray-900 font-medium mb-1 mt-2">Vehicle Type</label>
              <select id="vehicleType" value={vehicleType} onChange={handleVehicleTypeChange} className="w-full p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-600" required>
                <option value="">Select Vehicle Type</option>
                <option value="Tracktor">Tracktor</option>
                <option value="Compactor Truck">Compactor Truck</option>
                <option value="Smaller Front-Loader">Smaller Front-Loader</option>
                <option value="Larger Front-Loader">Larger Front-Loader</option>
                <option value="Small Rear Loader">Small Rear Loader</option>
                <option value="Medium Rear Loader">Medium Rear Loader</option>
                <option value="Large Rear Loader">Large Rear Loader</option>
                <option value="Light-Duty Roll-Off">Light-Duty Roll-Off Truck</option>
                <option value="Medium-Duty Roll-Off">Medium-Duty Roll-Off Truck</option>
                <option value="Heavy-Duty Roll-Off">Heavy-Duty Roll-Off Truck</option>
                <option value="Side Loader">Side Loader</option>
              </select>
            </div>

            <div>
              <label htmlFor="capacity" className="block text-gray-900 font-medium mb-1 mt-2">Capacity (Cubic Yards)</label>
              <input type="text" id="capacity" placeholder="Capacity will be auto-filled" value={capacity} readOnly 
              className="w-full p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-500 placeholder-gray-600" 
              onChange={(e) => setCapacity(e.target.value)} required/>
            </div>

            <div>
            <label htmlFor="env" className="block text-gray-900 font-medium mb-1 mt-2">Suitable Environments</label>
            <input type="text" id="env" placeholder="Suitable environments will be auto-filled" value={environment} readOnly
            className="w-full p-2 border-1 border-gray-400 rounded-lg text-sm placeholder-gray-500 text-gray-600"  
            onChange={(e) => setEnvironment(e.target.value)} required/>
            </div>
          </div>
          
          <hr className="border-t-4 border-black my-4" />

          <h3 className="text-l text-black font-bold mb-2 mt-4">Environmental Compliance</h3>
           <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="fuelType" className="block text-gray-900 font-medium mb-1 mt-2">Fuel Type</label>
              <select id="fuelType" value={fuelType} onChange={handleFuelTypeChange} className="w-75 p-2 border-1  border-gray-400 rounded-lg text-sm text-gray-600" required  >
                 <option value="">Select Fuel Type</option>
                 <option value="Diesel">Diesel</option>  
                 <option value="Electric">Electric</option>
                 <option value="CNG">CNG (Compressed Natural Gas)</option>
             </select>
           </div>

           <div>
           <label htmlFor="fuelCapacity" className="block text-gray-900 font-medium mb-1 mt-2">Fuel Capacity</label>
              <input type="text" id="fuelCapacity" placeholder="Fuel capacity will be auto-filled" value={fuelCapacity} readOnly 
              className="w-75 p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-500 placeholder-gray-600" 
              onChange={(e) => setFuelCapacity(e.target.value)} required/>
           </div>
          </div>
           
          <hr className="border-t-4 border-black my-4" />

          <div className="mb-4">
            <h3 className="text-l text-black font-bold mb-2 mt-4">Emission Standards</h3>
  
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <input type="radio" id="emissionPass" name="emissionCompliance" value="Pass" className="hidden" onChange={handleRadioChange}/>
                    <label htmlFor="emissionPass" className="text-m text-gray-500">
                    <span className={`w-4 h-4 inline-block rounded-full mr-2 border-2 ${emissionStandard === "Pass" ? "bg-green-500" : "border-gray-400"}`}></span>
                      Pass</label>
              </div>
    
              <div className="flex items-center">
                <input type="radio" id="emissionFail" name="emissionCompliance" value="Fail" className="hidden" onChange={handleRadioChange}/>
                   <label htmlFor="emissionFail" className="text-m text-gray-500">
                   <span className={`w-4 h-4 inline-block rounded-full mr-2 border-2 ${emissionStandard === "Fail" ? "bg-red-500" : "border-gray-400"}`}></span>
                    Fail</label>
             </div>
            </div>
          </div>
          
          <hr className="border-t-4 border-black my-4" />

          <h3 className="text-l text-black font-bold mb-4 mt-4 ">Insurance Requirments</h3>
            <div className="flex items-center mb-2">
              <label htmlFor="insuranceStartDate" className="block text-gray-900 font-medium mb-1 mr-20">Insurance Start Date</label>
                 <input type="date" id="insuranceStartDate" name="insuranceStartDate" className="w-25 p-2 border-1 border-gray-500 rounded-lg text-sm text-gray-600" required
                 value={insuranceRequirement.insuranceStartDate} onChange={handleInsuranceChange}/>
            </div>

            <div className="flex items-center mb-2">
              <label htmlFor="insuranceExpiryDate" className="block text-gray-900 font-medium mb-1 mr-10">Insurance Expiration Date</label>
                <input type="date" value={insuranceRequirement.insuranceExpiryDate} onChange={handleInsuranceExpiryDateChange} id="insuranceExpiryDate" name="insuranceExpiryDate" 
                className="w-25 p-2 border-1 border-gray-500 rounded-lg text-sm text-gray-600" required/>
            </div>

            <div className="mb-2">
              <label htmlFor="insuranceType" className="block text-gray-900 font-medium mb-2">Insurance Type</label>
                <select  id="insuranceType" name="insuranceType" className="w-50 p-2 border-1 border-gray-500 rounded-lg text-sm text-gray-600" required
                value={insuranceRequirement.insuranceType} onChange={handleInsuranceChange}>
                     <option value="">Select Insurance Type</option>
                     <option value="Comprehensive">Comprehensive</option>
                     <option value="Third-Party">Third-Party</option>
                     <option value="Collision">Collision</option>
                     <option value="Personal Injury Protection">Personal Injury Protection (PIP)</option>
                     <option value="Uninsured/Underinsured Motorist">Uninsured/Underinsured Motorist</option>
                     <option value="Commercial">Commercial Vehicle Insurance</option>
                  </select>
            </div>
            
            <hr className="border-t-4 border-black my-4" />

            <label htmlFor="maintainace" className="text-l text-black font-bold mb-4 mt-2">Maintanace Record</label>
            <textarea id="maintenance" name="maintenance" rows="4" placeholder="Enter details about the vehicle's maintenance history" 
            className="w-full p-2 border-1 border-gray-500 rounded-lg text-sm text-gray-600 placeholder-gray-500" value={maintenance}
            onChange={(e) => SetMaintenance(e.target.value)}></textarea>
            
            <hr className="border-t-4 border-black my-4" />

           <div className="flex items-center mb-4 mt-4">
               <label htmlFor="availability" className="text-l text-black font-bold mr-4">Availability</label>
               <button id="availability" type="button" onClick={handleToggle} className="flex items-center p-2 bg-gray-200 rounded-full" required>
                   {isAvailable ? (
                       <FaCheckCircle className="text-green-500 text-2xl" />
                       ) : (
                       <FaTimesCircle className="text-red-500 text-2xl" />
                       )}
                       <span className="ml-2 text-sm font-medium text-gray-700">
                        {isAvailable ? 'Available' : 'Unavailable'}
                 </span>
               </button>
           </div>

           <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg 
             focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">Update</button>
             
        </form>
      </div>
    </div>
  );
}


export default UpdateVehicles;