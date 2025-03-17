import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaUserShield, FaUsers, FaShoppingCart } from "react-icons/fa"; // Importing React Icons
import { ThemeContext } from "../../../context/AdminDashboard/ThemeContextProvider";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Home, People, ShoppingCart } from "@mui/icons-material";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import AreaDashboard from "../../Area&Users/AreaDashboard";

function CombinedList() {
  const { theme } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [activeTable, setActiveTable] = useState(null);
  const [showBottomNav, setShowBottomNav] = useState(false);

  useEffect(() => {
    // Fetch Users
    axios
      .get("http://localhost:8000/register/ViewUsers")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));

    // Fetch Buyers
    axios
      .get("http://localhost:8000/buyer/ViewBuyers")
      .then((res) => setBuyers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8000/buyer/BuyerDelete/" + id)
      .then((res) => {
        console.log(res);
        setBuyers(buyers.filter((buyer) => buyer._id !== id));
      })
      .catch((err) => console.log(err));
  };

  // Separate users based on role
  const admins = users.filter((user) => user.role === "admin");
  const nonAdmins = users.filter((user) => user.role !== "admin");

  const cardStyles = `p-6 rounded-lg shadow-lg w-[330px] h-[320px] cursor-pointer hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 
        ${
          theme === "dark"
            ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white"
            : "bg-gradient-to-r from-blue-100 to-blue-200 text-gray-800"
        } 
        ${
          theme === "dark"
            ? "shadow-2xl shadow-gray-900"
            : "shadow-lg shadow-blue-300"
        }`;

  const cardStyles2 = `rounded-lg shadow-lg w-[690px] h-[320px]'}`;

  const textColor = theme === "dark" ? "text-white" : "text-black";
  const bgGradient =
    theme === "dark"
      ? "bg-gradient-to-r from-gray-600 to-gray-600"
      : "bg-gradient-to-r from-blue-500 to-teal-400";

  const handleCardClick = (table) => {
    setActiveTable(table);
    setShowBottomNav(true);
  };

  const AdminData = {
    labels: ["Admins", "All Users"],
    datasets: [
      {
        data: [admins.length, admins.length + users.length],
        backgroundColor: ["#FF6384", "#9C27B0", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const NonAdminData = {
    labels: ["N-Admins", "Users"],
    datasets: [
      {
        data: [nonAdmins.length, admins.length + users.length],
        backgroundColor: ["#E91E63", "#FFC107", "#03A9F4"], //'#E91E63', '#9C27B0', '#FFC107', '#8BC34A', '#795548', '#607D8B'],
        hoverBackgroundColor: ["#45A049", "#FF8C00", "#0288D1"], //'#D81B60', '#E91E63', '#E91E63', '#689F38', '#E91E63', '#455A64']
      },
    ],
  };

  const BuyersData = {
    labels: ["Buyers", "All Users"],
    datasets: [
      {
        data: [admins.length, admins.length + users.length],
        backgroundColor: ["#607D8B", "#8BC34A", "#03A9F4"], //'#E91E63', '#9C27B0', '#FFC107', '#8BC34A', '#795548', '#607D8B'],
        hoverBackgroundColor: ["#45A049", "#FF8C00", "#0288D1"], //'#D81B60', '#7B1FA2', '#FFB300', '#689F38', '#5D4037', '#455A64']
      },
    ],
  };

  const AllUsersData = {
    labels: ["Admins", "Non Admins", "Buyers", "All Users"],
    datasets: [
      {
        data: [admins.length, nonAdmins.length, buyers.length],
        backgroundColor: ["#607D8B", "#FFC107", "#03A9F4"], //'#E91E63', '#9C27B0', '#FFC107', '#8BC34A', '#795548', '#607D8B'],
        hoverBackgroundColor: ["#45A049", "#FF8C00", "#0288D1"], //'#D81B60', '#7B1FA2', '#FFB300', '#689F38', '#5D4037', '#455A64']
      },
    ],
  };

  ChartJS.register(Title, Tooltip, Legend, ArcElement);

  return (
    <div
      className="flex flex-col items-center justify-center">

      {/* Card Containers */}
      {!showBottomNav && (
        <div className="flex flex-wrap gap-6 mb-20 justify-center">
          {/* Admin Users Card */}
          <div className={cardStyles} onClick={() => handleCardClick("admin")}>
            <div className="text-center">
              <h2 className={`text-xl font-bold `}>Admins - {admins.length}</h2>
              <br />
              <div className="w-[220px] h-[300px] mx-auto">
                <Pie data={AdminData} />
              </div>
            </div>
          </div>

          {/* Non-Admin Users Card */}
          <div className={cardStyles} onClick={() => handleCardClick("admin")}>
            <div className="text-center">
              <h2 className={`text-xl font-bold `}>
                Non Admins - {nonAdmins.length}
              </h2>
              <br />
              <div className="w-[220px] h-[300px] mx-auto">
                <Pie data={NonAdminData} />
              </div>
            </div>
          </div>

          {/* Buyers Card */}
          <div className={cardStyles} onClick={() => handleCardClick("admin")}>
            <div className="text-center">
              <h2 className={`text-xl font-bold `}>Buyers - {buyers.length}</h2>
              <br />
              <div className="w-[220px] h-[300px] mx-auto">
                <Pie data={BuyersData} />
              </div>
            </div>
          </div>

          {/* All users Card */}
          <div className={cardStyles} onClick={() => handleCardClick("admin")}>
            <div className="text-center">
              <h2 className={`text-xl font-bold `}>
                All Users - {buyers.length + users.length}
              </h2>
              <div className="w-[250px] h-[300px] mx-auto">
                <Pie data={AllUsersData} />
              </div>
            </div>
          </div>

          {/* Buyers Card */}
          <div className={cardStyles2}>
            <AreaDashboard />
          </div>
        </div>
      )}

      {activeTable === "admin" && (
        <div >
          <h1 className={`text-3xl font-bold text-center  mb-6`}>
            Admin Users
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins.map((user, index) => (
              <div key={index} className={`p-6 rounded-lg shadow-lg  `}>
                <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p className="text-gray-500 italic">Password: [Hashed]</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTable === "nonAdmin" && (
        <div >
          <h1 className={`text-3xl font-bold text-center  mb-6`}>
            Non-Admin Users
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nonAdmins.map((user, index) => (
              <div key={index} className={`p-6 rounded-lg shadow-lg  `}>
                <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p className="text-gray-500 italic">Password: [Hashed]</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTable === "buyers" && (
        <div >
          <h1 className={`text-3xl font-bold text-center  mb-6`}>Buyer List</h1>
          <a href="/CreateBuyer" className="text-blue-700 mb-4 inline-block">
            + New
          </a>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyers.map((buyer, index) => (
              <div key={index} className={`p-6 rounded-lg shadow-lg  `}>
                <h3 className="text-xl font-semibold mb-2">{buyer.name}</h3>
                <p>Email: {buyer.email}</p>
                <p>Phone: {buyer.phone}</p>
                <p className="text-gray-500 italic">Password: [Hashed]</p>
                <button
                  onClick={() => handleDelete(buyer._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {showBottomNav && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            color: "black",
          }}
          elevation={3}
        >
          <BottomNavigation
            value={activeTable}
            onChange={(event, newValue) => {
              setActiveTable(newValue);
            }}
            showLabels
          >
            <BottomNavigationAction
              label="Admins"
              value="admin"
              icon={<Home />}
            />
            <BottomNavigationAction
              label="Non-Admins"
              value="nonAdmin"
              icon={<People />}
            />
            <BottomNavigationAction
              label="Buyers"
              value="buyers"
              icon={<ShoppingCart />}
            />
          </BottomNavigation>
        </Paper>
      )}
    </div>
  );
}

export default CombinedList;
