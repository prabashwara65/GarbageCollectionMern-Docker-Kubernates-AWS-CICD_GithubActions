import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdateUsers() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPass] = useState("");
  const [iscollected, setIsCollected] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Get user id from URL parameters

  useEffect(() => {
    // Fetch current user data by ID
    axios
      .get(`http://localhost:4000/register/ViewUsers/${id}`)
      .then((res) => {
        const user = res.data;
        setName(user.name);
        setEmail(user.email);
        setArea(user.area);
        setPhone(user.phone);
        setIsCollected(user.iscollected);
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update user details
    axios
      .put(`http://localhost:4000/register/UpdateUsers/${id}`, {
        name,
        email,
        area,
        phone,
        password, // If the user doesn't change the password, you can opt not to send this.
        iscollected,
      })
      .then((res) => {
        alert("User updated successfully!");
        navigate("/ViewUsers");
      })
      .catch((err) => console.error("Error updating user:", err));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-700">
            Update User
          </h1>

          <div className="relative">
            <input
              type="text"
              value={name}
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
              value={email}
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
              value={area}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              onChange={(e) => setArea(e.target.value)}
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
              value={phone}
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
              value={password}
              placeholder="Password (leave blank if unchanged)"
              id="pass"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type="text"
              value={iscollected}
              placeholder="Is Collected"
              id="iscollected"
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setIsCollected(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            >
              Update
            </button>

            <a
              href="/ViewUsers"
              className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ml-2 text-center"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUsers;
