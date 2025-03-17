import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../../ReduxTool/userSlice';

const EditProfile = () => {
  const { name, email, phone } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch all users from the API
    axios.get('http://localhost:8000/register/ViewUsers')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    // Filter the users data to get the current logged-in user's data
    const user = users.find(user => user.name === name);
    if (user) {
      setCurrentUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [users, name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the user data in Redux
    dispatch(setUser({ ...currentUser, ...formData }));
    // You can also send this data to a backend server if needed
    console.log('Updated user details:', formData);
  };

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-gray-700 font-medium mb-1">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value="******" // Masked password
              className="p-3 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
              readOnly
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
