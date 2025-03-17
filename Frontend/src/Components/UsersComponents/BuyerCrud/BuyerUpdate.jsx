import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function BuyerUpdate() {
  const { id } = useParams(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPass] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing buyer data by ID
    axios.get(`http://localhost:8000/buyer/ViewBuyers/${id}`)
      .then(res => {
        const buyer = res.data;
        setName(buyer.name);
        setEmail(buyer.email);
        setPhone(buyer.phone);
        setPass(buyer.password);
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`http://localhost:8000/buyer/BuyerUpdate/${id}`, { name, email, phone, password })
      .then(res => {
        alert("Record updated successfully");
         navigate('/ViewBuyers'); // Redirect to buyers list or another page after update
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-700">Update Buyer</h1>

          <div className="relative">
            <input 
              type="text" 
              placeholder="Name" 
              id="name" 
              value={name}
              required 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <input 
              type="email" 
              placeholder="Email" 
              id="email" 
              value={email}
              required 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <input 
              type="number" 
              placeholder="Phone" 
              id="phone" 
              value={phone}
              required 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <input 
              type="password" 
              placeholder="Password" 
              id="pass" 
              value={password}
              required 
              onChange={(e) => setPass(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-between items-center space-x-4">
            <button 
              type="submit" 
              className="w-full py-2 text-white bg-indigo-500 hover:bg-indigo-600 rounded-md focus:outline-none"
            >
              Update Buyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BuyerUpdate;
