import React, { useState, useEffect } from 'react'
import NavigateButton from './NavigateButton' 
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


function UpdateDrivers() {

  const {id} = useParams()
  const [name, setName] = useState({
    firstName:"",
    lastName:"",
  });
const[dateOfBirth, setDateOfBrith] = useState("");
const[gender,setGender] = useState("");
const[address, setAddress] = useState({
    no:"",
    street:"",
    city:"",
})
const[phoneNumber,setPhoneNumber] = useState("");
const[flashMessage, setFlashMessage] = useState("");
const[email, setEmailAddress]=useState("");
const[nic, setNIC] = useState("");
const[employeeId, setEmployeeId] = useState("");
const[position, setPosition] = useState("");
const[hiredDate, setHireDate] = useState("");
const[status, setStatus] = useState("");
const [isAvailable, setIsAvailable] = useState('Available');
const [licenseRequirements, setLicenseRequirements] = useState({
  licenseNumber:"",
  licenseExpiryDate:""
}) 

const navigate = useNavigate();


useEffect(() => {
  axios.get('http://localhost:8000/drivers/getDriver/' + id)
  .then(result => {
    const driverData = result.data;

    const formattedDOB = new Date(driverData.dateOfBirth).toISOString().split('T')[0];
    // const formatteHiredDate = new Date(driverData.hiredDate).toISOString().split('T')[0];
    // const licenseExpiryDate = new Date(driverData.hiredDate).toISOString().split('T')[0];

    const formattedHiredDate = new Date(driverData.hiredDate).toISOString().split('T')[0]; // Properly formatted
    const formattedLicenseExpiryDate = new Date(driverData.licenseRequirements.licenseExpiryDate).toISOString().split('T')[0]; // Properly formatted


    setEmployeeId(driverData.employeeId);
    setName({
      firstName: driverData.name.firstName,
      lastName: driverData.name.lastName
    });
    setDateOfBrith(formattedDOB);
    setNIC(driverData.nic);
    setGender(driverData.gender);
    setAddress({
      no:driverData.address.no,
      street:driverData.address.street,
      city:driverData.address.city
    });
    setPhoneNumber(driverData.phoneNumber);
    setEmailAddress(driverData.email);
    setLicenseRequirements({
      licenseNumber: driverData.licenseRequirements.licenseNumber,
      licenseExpiryDate: formattedLicenseExpiryDate
    });
    setPosition(driverData.position);
    setHireDate(formattedHiredDate);
    setStatus(driverData.status);
    setIsAvailable(driverData.isAvailable);
    
  })
  .catch(err => console.log(err));
}, [id]);

 // Handle license requirements change
 const handleLicenseRequirementsChange = (e) => {
  const { id, value } = e.target;
  setLicenseRequirements((prevLicense) => ({
      ...prevLicense,
      [id]: value,
  }));
};


// Handle input changes for first and last name
const handleNameChange = (e) => {
const { id, value } = e.target;
setName((prevName) => ({
    ...prevName,
    [id]: value,
}));
};


// Handle gender change
const handleGenderChange = (e) => {
setGender(e.target.value);
};

// Handle address changes
const handleAddressChange = (e) => {
const { id, value } = e.target;
setAddress((prevAddress) => ({
    ...prevAddress,
    [id]: value,
}));
};

//handle phone number 
const handlePhoneNumberChange = (e) => {
const value = e.target.value; 
setPhoneNumber(value);

//validate phone number 
const phoneNumberRegex = /^\d{10}$/;
if (!phoneNumberRegex.test(value)) {
  setFlashMessage("Please enter a valid 10-digit phone number.");

  // Clear the flash message after 3 seconds
  setTimeout(() => {
    setFlashMessage("");
  }, 3000);
} else {
  setFlashMessage(""); // Clear the message if the number is valid
}
};

//handle nic number
const handleNICChange = (e) => {
const value = e.target.value;
setNIC(value);

//define pattern 
const newNICPattern = /^\d{12}$/; 
const oldNICPattern = /^\d{9}[Vv]$/;

//validate
if(!newNICPattern.test(value) && !oldNICPattern.test(value)){
    setFlashMessage("Invalid NIC number. It should be either a 12-digit number or a 9-digit number followed by 'V' or 'v'.");
    setTimeout(() => {
        setFlashMessage("");
    }, 3000);
} else {
    setFlashMessage("");
}
};


// Handle employment status change
const handleStatusChange = (e) => {
setStatus(e.target.value);
};

// Function to check if the license is expired
const checkLicenseExpiry = () => {
const today = new Date();
const expiryDate = new Date(licenseRequirements.licenseExpiryDate);
setIsAvailable(expiryDate >= today ? 'Available' : 'Unavailable');

};

// Check license expiry whenever the licenseExpiryDate changes
useEffect(() => {
if (licenseRequirements.licenseExpiryDate) {
  checkLicenseExpiry();
}
}, [licenseRequirements.licenseExpiryDate]);

// Handle availability toggle
const handleToggle = () => {
setIsAvailable(isAvailable === 'Available' ? 'Unavailable' : 'Available');
};


const Update = (e) => {
e.preventDefault();

axios.put(`http://localhost:8000/drivers/updateDriver/${id}` , {
employeeId, name:{
  firstName:(name.firstName),
  lastName:(name.lastName)
}, dateOfBirth, nic, gender, address: {
  no:(address.no),
  street: (address.street),
  city: (address.city)
},phoneNumber,email, licenseRequirements: {
  licenseNumber: (licenseRequirements.licenseNumber),
  licenseExpiryDate: (licenseRequirements.licenseExpiryDate)
},position,hiredDate, status,isAvailable
})
.then(() => {
  alert('Driver details updated successfully!');
navigate('/drivers')
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
            <h1 className="text-2xl font-bold text-black mb-3 text-center">Edit Driver Information</h1>
            <h3 className="text-l font-bold text-black mb-2 underline">Personal Information</h3>
              <div className='grid grid-cols-2 gap-4'>
                   <div>
                        <label htmlFor="first_name" className="block text-gray-900 font-medium mb-1 mt-2 font-semibold">First Name</label>
                        <input type="text" id="firstName" placeholder="Enter your first Name" value={name.firstName} 
                        className="w-full p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-500 placeholder-gray-600 mb-3 " required
                        onChange={handleNameChange}/>
                   </div>
                 
                   <div>
                        <label htmlFor="last_name" className="block text-gray-900 font-medium mb-1 mt-2 font-semibold">Last Name</label>
                        <input type="text" id="lastName" placeholder="Enter your last name" value={name.lastName} 
                        className="w-full p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-500 placeholder-gray-600 mb-3" required
                        onChange={handleNameChange}/>
                   </div>
             </div>   

             <label htmlFor="nic" className="block text-gray-900 font-medium mb-1 mt-3 font-semibold">National Identy Card Number (NIC)</label>
             <input type="type" id="nic" placeholder="Enter your NIC number"
             value={nic} className="w-25 p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-600 mb-3" required 
             onChange={handleNICChange}/> 

             <label htmlFor="dateOfBrith" className="block text-gray-900 font-medium mb-1 mt-3 font-semibold">Date of Brith</label>
             <input type="date" id="dateOfBrith" placeholder="Enter your birthdate"
             value={dateOfBirth} className="w-25 p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-600 mb-3" required 
             onChange={(e) => setDateOfBrith(e.target.value)}/> 


            <label htmlFor="gender" className="block text-gray-900 font-medium mb-1 mt-3 font-semibold">Gender</label>
            <div className="flex space-x-6 ">
                    <label className="flex items-center">
                        <input type="radio" id="male" name="gender" value="Male" checked={gender === "Male"} onChange={handleGenderChange} className="mr-2 mb-3 mt-2"/>
                        <div className='text-gray-700 text-sm mb-3 mt-2'>Male</div>
                    </label>
                    <label className="flex items-center">
                        <input type="radio" id="female" name="gender" value="Female" checked={gender === "Female"} onChange={handleGenderChange} className="mr-2 mb-3 mt-2"/>
                        <div className='text-gray-700 text-sm mb-3 mt-2'>Female</div>
                    </label>
                    <label className="flex items-center">
                    <input type="radio" id="other" name="gender" value="Other" checked={gender === "Other"} onChange={handleGenderChange} className="mr-2 mb-3 mt-2"/>
                        <div className='text-gray-700 text-sm mb-3 mt-2'>Other</div>
                    </label>
                </div>

            <label htmlFor="address" className="block text-gray-900 font-medium mb-2 mt-3 font-semibold">Address</label>  
            <div className='grid grid-cols-3 gap-4'>
                    <div className="flex items-center mb-3">
                        <label htmlFor="no"  className="block text-gray-900 font-medium mr-2 ">No:</label>
                        <input type="text" id="no" placeholder="Enter your address" value={address.no} 
                        className="w-full p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-500 placeholder-gray-600 mb-3" required
                        onChange={handleAddressChange}/>
                   </div>
             
                   <div className="flex items-center mb-3">
                        <label htmlFor="street" className="block text-gray-900 font-medium mb-1 mt-2 mr-2">Street:</label>
                        <input type="text" id="street" placeholder="Enter your address" value={address.street} 
                        className="w-full p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-500 placeholder-gray-600 mb-3" required
                        onChange={handleAddressChange}/>
                   </div>

                   <div className="flex items-center mb-3">
                        <label htmlFor="city" className="block text-gray-900 font-medium mb-1 mt-2 mr-2">City:</label>
                        <input type="text" id="city" placeholder="Enter your address" value={address.city} 
                        className="w-full p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-500 placeholder-gray-600 mb-3" required
                        onChange={handleAddressChange}/>
                   </div>
                </div>
                
                <label htmlFor="phoneNumber" className="block text-gray-900 font-medium mb-1 mt-2 font-semibold">Contact Number</label>
                <input type="tel" id="phoneNumber" placeholder="Enter your contact number" value={phoneNumber} 
                className="w-25 p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-600 mb-3" required 
                onChange={handlePhoneNumberChange}/>

             {flashMessage && (
               <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
               {flashMessage}
               </div>
            )}

                <label htmlFor="email" className="block text-gray-900 font-medium mb-1 mt-3 font-semibold">Email Address</label>
                    <input type="email" id="email" placeholder="Enter your email address" value={email} 
                    className="w-25 p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-600" required 
                    onChange={(e) => setEmailAddress(e.target.value)}/>
            

            <hr className="border-t-4 border-black my-4" />
            <h3 className="text-l font-bold text-black mb-2 underline">License Information</h3>

            <label htmlFor="licenseNumber" className="block text-gray-900 font-medium mb-1 mt-3 font-semibold">Driver License Number</label>
             <input type="text" id="licenseNumber" placeholder="Enter your driver license number"
             value={licenseRequirements.licenseNumber} className="w-25 p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-600 mb-3" required 
             onChange={handleLicenseRequirementsChange}/> 

             <label htmlFor="licenseExpiryDate" className="block text-gray-900 font-medium mb-1 mt-3 font-semibold">License Expiry Date</label>
             <input type="date" id="licenseExpiryDate" placeholder="Enter license expiry date"
             value={licenseRequirements.licenseExpiryDate} className="w-25 p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-600 mb-3" 
             onChange={handleLicenseRequirementsChange} required /> 

             <hr className="border-t-4 border-black my-4" />
             <h3 className="text-l font-bold text-black mb-2 underline">Employee Information</h3>

             <label htmlFor="employeeId" className="block text-gray-900 font-medium mb-1 mt-3 font-semibold">Employee ID</label>
             <input type="text" id="employeeId" placeholder="Enter employee Id"
             value={employeeId} className="w-25 p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-600 mb-3"  readOnly required /> 

             <label htmlFor="position" className="block text-gray-900 font-medium mb-1 mt-3 font-semibold">Position</label>
                 <select id="position" value={position} onChange={(e) => setPosition(e.target.value)} className="w-50 p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-600 mb-3"
                 required>
                     <option value="">Select a position</option>
                     <option value="garbageTruckDriver">Garbage Truck Driver</option>
                     <option value="leadDriver">Lead Driver / Senior Garbage Truck Driver</option>
                     <option value="routeSupervisor">Route Supervisor</option>
                     <option value="operationsSupervisor">Operations Supervisor / Manager</option>
                     <option value="dispatcher">Dispatcher</option>
                     <option value="recyclingCoordinator">Recycling Coordinator</option>
                 </select>

             <label htmlFor="hiredDate" className="block text-gray-900 font-medium mb-1 mt-3 font-semibold">Date of Hire</label>
             <input type="date" id="hiredDate" placeholder="Enter Hired Date"
             value={hiredDate} className="w-25 p-2 border-1 border-gray-400 rounded-lg text-sm text-gray-600 mb-3" required 
             onChange={(e) => setHireDate(e.target.value)}/> 

             <label htmlFor="status" className="block text-gray-900 font-medium mb-1 mt-3 font-semibold">Employeement Status</label>
             <div className="flex space-x-6">
                     <label className="flex items-center">
                         <input type="radio" id="fullTime" name="status" value="Full-Time" checked={status === "Full-Time"} 
                           onChange={handleStatusChange} className="mr-2 mt-2" />
                      <div className='text-gray-700 text-sm mt-2'>Full-Time</div>
                     </label>

                     <label className="flex items-center">
                         <input type="radio" id="contract" name="status" value="Contract" checked={status === "Contract"} 
                             onChange={handleStatusChange} className="mr-2 mt-2" />
                     <div className='text-gray-700 text-sm mt-2'>Contract</div>
                     </label>
            </div>

            <hr className="border-t-4 border-black my-4" />
            
            <div className="flex items-center mb-4 mt-4">
             <label htmlFor="availability" className="text-l text-black font-bold mr-4">Availability</label>
               <button id="availability" type="button" onClick={handleToggle} className="flex items-center p-2 bg-gray-200 rounded-full" required>
               {isAvailable === 'Available' ? (
                        <FaCheckCircle className="text-green-500 text-2xl" />
                    ) : (
                        <FaTimesCircle className="text-red-500 text-2xl" />
                    )}
                    <span className="ml-2 text-sm font-medium text-gray-700">
                        {isAvailable === 'Available' ? 'Available' : 'Unavailable'}
                   </span>
               </button>
           </div>

           <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">Submit</button>
        </form>
     </div>
</div>
)
}

export default UpdateDrivers
