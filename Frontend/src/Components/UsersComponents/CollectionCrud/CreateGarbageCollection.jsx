import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateGarbageCollection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPass] = useState("");
  const [iscollected, setIsCollected] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:4000/register/ViewUsers", {
        name,
        email,
        phone,
        password,
        iscollected,
      })
      .then((res) => {
        alert("Record insert successfully");
        navigate("/ViewGarbageColletion");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-700">
            Create new GarbageColletion
          </h1>

          <div className="relative">
            <input
              type="text"
              placeholder="Name"
              id="name"
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
              required
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Radio buttons for collection status */}
          <div className="mt-4">
            <label className="mr-4">
              <input
                type="radio"
                name="iscollected"
                value="collected"
                checked={iscollected === "collected"}
                onChange={(e) => setIsCollected(e.target.value)}
                className="mr-2"
              />
              Collected
            </label>

            <label>
              <input
                type="radio"
                name="iscollected"
                value="not_collected"
                checked={iscollected === "not_collected"}
                onChange={(e) => setIsCollected(e.target.value)}
                className="mr-2"
              />
              Not Collected
            </label>
          </div>

          <div className="flex justify-between items-center space-x-4">
            <button
              type="submit"
              className="w-full py-2 text-white bg-indigo-500 hover:bg-indigo-600 rounded-md focus:outline-none"
            >
              Create Buyer
            </button>
            {/* <a 
              href="/Login" 
              className="w-full py-2 text-center text-indigo-500 hover:underline"
            >
              Login
            </a> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGarbageCollection;
