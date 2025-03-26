import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPass] = useState("");
  const [iscollected, setIsCollected] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:4000/register/register", {
        name,
        email,
        area,
        phone,
        password,
        iscollected,
      })
      .then((res) => {
        alert("Account created successfully!");
        navigate("/Login");
        console.log(res)
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-700">
            Register
          </h1>

          <div className="relative">
            <input
              type="text"
              placeholder="Name"
              id="name"
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              id="email"
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              id="area1"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              defaultValue="" // Using defaultValue instead of selected attribute
              onChange={(e) => setArea(e.target.value)} // Assuming setArea is a state setter for the selected area
            >
              <option value="" disabled>
                Select Area
              </option>
              <option value="Area 1">Area 1</option>
              <option value="Area 2">Area 2</option>
              <option value="Area 3">Area 3</option>
            </select>
          </div>

          <div className="relative">
            <input
              type="number"
              placeholder="Phone"
              id="phone"
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              id="pass"
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            >
              Register
            </button>

            <a
              href="/Login"
              className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ml-2 text-center"
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
