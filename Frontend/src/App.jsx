import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./Components/UsersComponents/Register/Register";
import ViewUsers from "./Components/UsersComponents/Register/ViewUsers";
import UsersDashboard from "./Components/UsersComponents/UsersDashboard/UsersDashboard"

import Login from "./Components/UsersComponents/Login/Login";
import DashBoard from "./Components/UsersComponents/Dashboard//DashBoard";
import NavHome from "./Components/UsersComponents/Home/Home";

import CreateBuyer from "./Components/UsersComponents/BuyerCrud/CreateBuyer"
import ViewBuyrs from "./Components/UsersComponents/BuyerCrud/ViewBuyers"
import BuyerUpdate from "./Components/UsersComponents/BuyerCrud/BuyerUpdate"

import UserProfileDashboard from "./Components/UsersComponents/UserProfile/UserProfileDashboard";


import { Provider } from "react-redux";
import store from "../src/Components/ReduxTool/Store";

// Admin DashBoard
import DashBoard1 from "./Components/AdminDashboard/Dashboard";
//Vehicles
import Vehicles from "./Components/VehicleComponents/Vehicles";
import CreateVehicles from "./Components/VehicleComponents/CreateVehicles";
import UpdateVehicles from "./Components/VehicleComponents/UpdateVehicles"
//Drivers
import Drivers from "./Components/DriverComponent/Drivers";
import CreateDrivers from "./Components/DriverComponent/CreateDrivers";
import UpdateDrivers from "./Components/DriverComponent/UpdateDrivers";

// Map
import MapView from "./Components/Map/MapView";
//import MapView from "./Components/Map/MapView";

// //AreaDetails
// import AreaDetails from "./Components/Area&Users/AreaDetails";

import AssigntmentDashboard from "./Components/Area&Users/AreaAssignment"

//paths for CreateGarbageCollection
import CreateGarbageCollection from "./Components/UsersComponents/CollectionCrud/CreateGarbageCollection"
import ViewGarbageCollection from "./Components/UsersComponents/CollectionCrud/ViewGarbageCollection"
import UpdateGarbageCollection from "./Components/UsersComponents/CollectionCrud/UpdateGarbageCollection"


//path for email send
import ConfirmPage from "./Components/UsersComponents/EmailAndSms/SendConfirm"
import GetConfirm from "./Components/UsersComponents/EmailAndSms/GetConfirmation"
import BuyerDashboard from "./Components/Buyer/buyerDashboard";
import UpdateUsers from "./Components/UsersComponents/Register/UpdateUsers";
import VehicleAndDriversReport from "./Components/Reports/reportDriverAndVehicles";
import GarbageEntries from "./Components/Reports/GarbageEntries";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          {/* Prabashwara's routes */}
          <Route path="/" element={<NavHome />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/ViewUsers" element={<ViewUsers />} />
          <Route path="/UpdateUsers/:id" element={<UpdateUsers />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/DashBoard" element={<DashBoard />} />
          <Route path="/UsersDashboard" element={<UsersDashboard />}/>

          {/* Buyers */}
          <Route path="/ViewBuyers" element={<ViewBuyrs/>} />
          <Route path="/CreateBuyer" element={<CreateBuyer/>} />
          <Route path="/BuyerUpdate/:id" element={<BuyerUpdate/>} />
          <Route path="/BuyerDashboard" element={<BuyerDashboard/>} />

          {/* UserProfile */}
          <Route path="/UserProfileDashboard" element={<UserProfileDashboard/>} />


          {/* AdminDashboard */}
          <Route path="/adminDashboard" element={<DashBoard1 />} />

          {/* Garbage Collection Vehicle */}
          <Route path="/vehicles" element={< Vehicles/>} />
          <Route path="/createVehicles" element={<CreateVehicles />} />
          <Route path="/updateVehicles/:id" element={<UpdateVehicles />} />

          {/* Route path for Map */}
          <Route path="/map" element={<MapView/>} />
          
          {/* Drivers */}
          <Route path="/drivers" element={<Drivers/>}/>
          <Route path="/createDrivers" element={<CreateDrivers/>}/>
          <Route path="/updateDrivers/:id" element={<UpdateDrivers/>}/>

          {/* Area Details
          <Route path="/area/:area" element={<AreaDetails users={users} />} /> */}

          <Route path="/areaAssigntment" element={<AssigntmentDashboard/>}/>

          {/* GarbageCollection */}
          <Route path="/CreateGarbageCollection" element={<CreateGarbageCollection />} />
          <Route path="/ViewGarbageCollection" element={<ViewGarbageCollection />} />
          <Route path="/UpdateGarbageCollection/:id" element={<UpdateGarbageCollection />} />

          {/* Send emails and get res */}
          <Route path="/ConfirmPage" element={<ConfirmPage />} />
          <Route path="/GetConfirmUpdate/:id" element={<GetConfirm />} />

          {/* Reports */}
          <Route path="/VehicleAndDriversReport" element={<VehicleAndDriversReport />} />
          <Route path="/GarbageEntries" element={<GarbageEntries />} />
          


        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;