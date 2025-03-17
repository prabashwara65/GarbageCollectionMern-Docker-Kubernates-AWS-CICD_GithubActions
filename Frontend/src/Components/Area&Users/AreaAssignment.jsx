import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ConfirmationModal from "./ConfirmationModal";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const AreaAssignment = () => {
  // const users = [
  //   { name: "User1", area: "Area 1", status: "complete" },
  //   { name: "User2", area: "Area 1", status: "pending" },
  //   { name: "User3", area: "Area 2", status: "complete" },
  //   { name: "User4", area: "Area 2", status: "incomplete" },
  //   { name: "User5", area: "Area 3", status: "complete" },
  //   { name: "User6", area: "Area 3", status: "incomplete" },
  //   { name: "User7", area: "Area 3", status: "pending" },
  //   { name: "User8", area: "Area 1", status: "incomplete" },
  //   { name: "User9", area: "Area 2", status: "pending" },
  //   { name: "User10", area: "Area 2", status: "pending" },
  // ];

  const [users, setUsers] = useState([]); // State to hold user data

  useEffect(() => {
    // Function to fetch all users
    const fetchUsers = () => {
      axios
        .get("http://localhost:8000/register/ViewUsers") 
        .then((res) => {
          setUsers(res.data); // Set the fetched users data
          setLoading(false); // Stop loading when data is fetched
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          setError("Error fetching users");
          setLoading(false); // Stop loading even if there is an error
        });
    };

    fetchUsers(); 
  }, []);


  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]); // State to hold fetched drivers
  const [loading, setLoading] = useState(true);
  const [assignedVehicles, setAssignedVehicles] = useState({
    Area1: null,
    Area2: null,
    Area3: null,
  });

  const [assignedDrivers, setAssignedDrivers] = useState({
    Area1: null,
    Area2: null,
    Area3: null,
  });

  const [notification, setNotification] = useState({
    message: "",
    type: "",
    show: false,
  });

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false); // Modal state for drivers
  const [selectedArea, setSelectedArea] = useState("");
 
  const areaData = {
    Area1: users.filter((user) => user.area === "Area 1"),
    Area2: users.filter((user) => user.area === "Area 2"),
    Area3: users.filter((user) => user.area === "Area 3"),
  };

  // confirmation
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [isDriver, setIsDriver] = useState(false); // To differentiate between driver and vehicle

  // Fetch vehicles from API
  useEffect(() => {
    axios
      .get("http://localhost:8000/vehicles/vehicles")
      .then((res) => {
        setVehicles(res.data); // Assume res.data contains array of vehicles
        setLoading(false); // Stop loading after fetching data
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); // Stop loading even if there is an error
      });
  }, []);

  // Fetch drivers from API
  useEffect(() => {
    axios
      .get("http://localhost:8000/drivers/drivers") 
      .then((res) => {
        setDrivers(res.data); // Assume res.data contains array of drivers
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const preparePieData = (usersInArea) => {
    const collected = usersInArea.filter((user) => user.iscollected === "collected").length;
    const not_collected = usersInArea.filter((user) => user.iscollected === "not_collected").length;
    

    return {
      labels: ["collected", "not_collected"],
      datasets: [
        {
          data: [collected, not_collected],
          backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
        },
      ],
    };
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
        labels: {
          color: "black",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const handleAssignVehicle = (area) => {
    setSelectedArea(area);
    setShowVehicleModal(true);
  };

  const handleAssignDriver = (area) => {
    setSelectedArea(area);
    setShowDriverModal(true); // Open the driver modal
  };

  const closeNotification = () => {
    setNotification({ message: "", type: "", show: false });
  };

  const closeVehicleModal = () => {
    setShowVehicleModal(false);
  };

  const closeDriverModal = () => {
    setShowDriverModal(false);
  };

  const assignVehicleToArea = (vehicle) => {
    const assignmentData = {
      vehicleId: vehicle.vehicleId,
      vehicleNumber: vehicle.vehicleNumber,
      vehicleType: vehicle.vehicleType,
      area: selectedArea,
    };
  
    // Save the assignment to the database
    axios
      .post("http://localhost:8000/vehicleAssignments/assign", assignmentData)
      .then((response) => {
        // After assignment is saved, update the vehicle availability
        return axios.put(`http://localhost:8000/vehicles/vehicles/${vehicle._id}`, {
          isAvailable: "Unavailable",
        });
      })
      .then((response) => {
        // Both assignment and availability update succeeded
        setAssignedVehicles((prev) => ({
          ...prev,
          [selectedArea]: vehicle,
        }));
        setNotification({
          message: `Vehicle ${vehicle.vehicleId} assigned to ${selectedArea}`,
          type: "vehicle",
          show: true,
        });
        setShowVehicleModal(false);
      })
      .catch((error) => {
        console.error("Error assigning vehicle or updating availability:", error);
        setNotification({
          message: `Failed to assign vehicle ${vehicle.vehicleId} to ${selectedArea}`,
          type: "vehicle",
          show: true,
        });
      });
  };
  

  const assignDriverToArea = (driver) => {
    const assignmentData = {
      employeeId: driver.employeeId,
      name: {
        firstName: driver.name.firstName,
        lastName: driver.name.lastName,
      },
      position: driver.position,
      area: selectedArea,
    };
  
    // Send driver assignment to the database
    axios
      .post("http://localhost:8000/driverAssignments/assignDriver", assignmentData)
      .then((response) => {
        // Successfully saved the driver assignment
        setAssignedDrivers((prev) => ({
          ...prev,
          [selectedArea]: driver,
        }));
  
        setNotification({
          message: `Driver ${driver.name.firstName} ${driver.name.lastName} assigned to ${selectedArea}`,
          type: "driver",
          show: true,
        });
  
        setShowDriverModal(false); // Close the modal
      })
      .catch((error) => {
        console.error("Error assigning driver:", error);
        setNotification({
          message: `Failed to assign driver ${driver.name.firstName} ${driver.name.lastName} to ${selectedArea}`,
          type: "driver",
          show: true,
        });
      });
  };
  
  //fetch assigned vehicle
  useEffect(() => {
    axios.get("http://localhost:8000/vehicleAssignments/assignall")
    .then((response) => {
      setAssignedVehicles(response.data);
    })
    .catch((error) => {
      console.error("Error fetching vehicle assignments:", error);
    })
  },[]);


  const cancelVehicleAssignment = (area) => {
    const vehicle = assignedVehicles[area];
    // Update the asssigned vehicle state to null
    setAssignedVehicles((prev) => ({
      ...prev,
      [area]: null,
    }));

    // Update the vehicle availability in the database
    axios
      .put(`http://localhost:8000/vehicles/vehicles/${vehicle._id}`, {
        isAvailable: "Available",
      })
      .then((response) => {
        setNotification({
          message: `Vehicle ${vehicle.vehicleId} has been unassigned from ${area}`,
          type: "vehicle",
          show: true,
        });
      })
      .catch((error) => {
        console.error("Error updating vehicle availability:", error);
        setNotification({
          message: `Failed to unassign vehicle ${vehicle.vehicleId} from ${area}`,
          type: "vehicle",
          show: true,
        });
      });
  };

  const cancelDriverAssignment = (area) => {
    const driver = assignedDrivers[area];
    
    // Update the assigned driver state to null
    setAssignedDrivers((prev) => ({
      ...prev,
      [area]: null,
    }));
  
    // Update the driver's availability in the database
    axios
      .put(`http://localhost:8000/drivers/drivers/${driver._id}`, {
        isAvailable: "Available",
      })
      .then((response) => {
        setNotification({
          message: `Driver ${driver.name.firstName} ${driver.name.lastName} has been unassigned from ${area}`,
          type: "driver",
          show: true,
        });
      })
      .catch((error) => {
        console.error("Error updating driver availability:", error);
        setNotification({
          message: `Failed to unassign driver ${driver.name.firstName} ${driver.name.lastName} from ${area}`,
          type: "driver",
          show: true,
        });
      });
  };

  //confirmation
  const handleMarkAsComplete = (assignment, isDriver) => {
    setCurrentAssignment(assignment);
    setIsDriver(isDriver);
    setShowConfirmationModal(true);
  };
  
  const confirmMarkAsComplete = () => {
    // Check if the current assignment is a driver
    if (isDriver) {
      const { employeeId } = currentAssignment; // Get current assigned driver employeeID
      const area = selectedArea; // Get the assigned area
  
      // Fetch the last assignment entry for the driver
      axios
        .get(`http://localhost:8000/driverAssignments/driverAssignments?employeeId=${employeeId}&area=${area}`)
        .then((response) => {
          const lastAssignment = response.data; // Assuming the response is the last assignment entry
  
          // Check if the response is valid and has at least one entry
          if (lastAssignment && lastAssignment.length > 0) {
            const { _id } = lastAssignment[0]; // Get the _id (MongoDB ObjectId) from the last entry
  
            // Update the isComplete column to true for the last assignment entry using the _id
            return axios.put(`http://localhost:8000/driverAssignments/driverAssignments/${_id}`, {
              isComplete: true,
            });
          } else {
            throw new Error('No assignment found for this driver in the specified area');
          }
        })
        .then(() => {
          // Successfully marked the assignment as complete
          setNotification({
            message: `Driver ${currentAssignment.name.firstName} ${currentAssignment.name.lastName} marked as complete.`,
            type: "driver",
            show: true,
          });
        })
        .catch((error) => {
          console.error("Error marking driver as complete:", error);
          setNotification({
            message: `Failed to mark driver ${currentAssignment.name.firstName} ${currentAssignment.name.lastName} as complete.`,
            type: "driver",
            show: true,
          });
        });
    } else {
      // Handle vehicle completion logic
    const { vehicleId } = currentAssignment; // Get current assigned vehicle ID
    const area = selectedArea; // Get the assigned area

    // Fetch the last assignment entry for the vehicle
    axios
      .get(`http://localhost:8000/vehicleAssignments/vehicleAssignments?vehicleId=${vehicleId}&area=${area}`)
      .then((response) => {
        const lastAssignment = response.data;
        if (lastAssignment && lastAssignment.length > 0) {
          const { _id } = lastAssignment[0]; // Get the record ID from the last entry

          // Update the isComplete column to true for the last assignment entry
          return axios.put(`http://localhost:8000/vehicleAssignments/vehicleAssignments/${_id}`, {
            isComplete: true,
          });
        } else {
          throw new Error('No assignment found for this vehicle in the specified area');
        }
      })
      .then(() => {
        setNotification({
          message: `Vehicle ${currentAssignment.vehicleNumber} marked as complete.`,
          type: "vehicle",
          show: true,
        });
      })
      .catch((error) => {
        console.error("Error marking vehicle as complete:", error);
        setNotification({
          message: `Failed to mark vehicle ${currentAssignment.vehicleNumber} as complete.`,
          type: "vehicle",
          show: true,
        });
      });
    }
  
    setShowConfirmationModal(false);
    setCurrentAssignment(null);
    setIsDriver(false);
  };
  
  

  const cancelMarkAsComplete = () => {
    setShowConfirmationModal(false);
    setCurrentAssignment(null);
    setIsDriver(false);
  };


  
  return (
    <div className="h-100vh bg-gradient-to-r from-lime-500 to-green-400 dark:bg-gradient-to-r dark:from-gray-800 dark:to-black text-black ">
      <div className="p-2">
        <div className="bg-white shadow-lg rounded-lg p-2 bg-opacity-50 flex justify-around space-x-2">
          {Object.entries(areaData).map(([areaName, usersInArea], index) => (
            <div key={index} className="w-1/3 p-2">
              <h3 className="text-xl font-semibold mb-2 text-center">
                {areaName}
              </h3>
              <div className="h-32">
                <Pie data={preparePieData(usersInArea)} options={pieOptions} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="m-2 p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(areaData).map(([areaName, usersInArea], index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-4 bg-opacity-70"   >
            <h3 className="text-xl font-semibold mb-2 text-center">
              {areaName}
            </h3>

            <div className="flex justify-between mb-2">
              <span className="font-semibold text-sm text-gray-800">
                User Name
              </span>
              <span className="font-semibold text-sm text-gray-800">
                Status
              </span>
            </div>

            <ul className="list-disc list-inside">
              {usersInArea.map((user, idx) => (
                <li key={idx} className="mb-1 flex justify-between">
                  <span className="text-sm text-gray-800">{user.name}</span>
                  <span
                    className={`text-sm ${
                      user.iscollected === "collected"
                        ? "text-green-600"
                        : user.iscollected === "not_collected"
                        ? "text-red-600"
                        : "text-red-600"
                    }`} >
                    {user.iscollected}
                  </span>
                </li>
              ))}
            </ul>

            <div className="justify-between mt-4">
              <button
                onClick={() => handleAssignVehicle(areaName)}
                className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2">
                Assign Vehicle
              </button>
              <button
                onClick={() => handleAssignDriver(areaName)}
                className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600" >
                Assign Driver
              </button>
            </div>

            {assignedVehicles[areaName] && (
              <div className="mt-4 p-3 border-t border-gray-300 bg-green-50 rounded-lg">
                <h4 className="text-sm font-semibold text-green-700">
                  Assigned Vehicle:
                </h4>
                <p className="text-sm text-gray-600">
                  <strong>ID:</strong> {assignedVehicles[areaName].vehicleId}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Vehicle Number:</strong>{" "}
                  {assignedVehicles[areaName].vehicleNumber}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Type:</strong>{" "}
                  {assignedVehicles[areaName].vehicleType}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Suitable Environment:</strong>{" "}
                  {assignedVehicles[areaName].environment}
                </p>
                <button
                  onClick={() =>
                    handleMarkAsComplete(assignedVehicles[areaName], false)
                  }
                  className="mt-2 bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600">
                  Mark as Complete
                </button>
                <button
                  onClick={() => cancelVehicleAssignment(areaName)}
                  className="mt-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">
                  Cancel Assignment
                </button>
              </div>
            )}

            {assignedDrivers[areaName] && (
              <diV className="mt-4 p-3 border-t border-gray-300 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-700">
                  Assigned Employee:
                </h4>
                <p className="text-sm text-gray-600">
                  <strong>ID:</strong> {assignedDrivers[areaName].employeeId}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Name:</strong>{" "}
                  {assignedDrivers[areaName].name.firstName +
                    " " +
                    assignedDrivers[areaName].name.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Position:</strong>{" "}
                  {assignedDrivers[areaName].position}
                </p>
                <button
                  onClick={() =>
                    handleMarkAsComplete(assignedDrivers[areaName], true)
                  }
                  className="mt-2 bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600" >
                  Mark as Complete
                </button>
                <button
                  onClick={() => cancelDriverAssignment(areaName)}
                  className="mt-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">
                  Cancel Assignment
                </button>
              </diV>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
              show={showConfirmationModal}
              onConfirm={confirmMarkAsComplete}
              onCancel={cancelMarkAsComplete}
              message={`Confirm completion: Mark the task for the ${isDriver ? 'driver' : 'vehicle'} as complete?`}
            />
          </div>
        ))}
      </div>

      {notification.show && (
        <div className="fixed top-5 right-5 bg-opacity-90 bg-white text-black p-4 rounded-lg shadow-md flex items-center space-x-4">
          <div
            className={`p-2 rounded-full ${
              notification.type === "vehicle" ? "bg-green-600" : "bg-green-600"
            }`}
          >
            {notification.type === "vehicle" ? "🚛" : "👷"}
          </div>
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={closeNotification}
            className="text-sm text-white bg-red-500 hover:bg-red-600 p-1 px-2 rounded-lg"
          >
            Close
          </button>
        </div>
      )}

      {/* Vehicle Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-3/4 max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              Select a Refuse Truck for {selectedArea}
            </h2>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-2 gap-4">
              {loading ? (
                <p>Loading vehicles...</p>
              ) : vehicles.length > 0 ? (
                vehicles.map((vehicle) => {
                  // Check if the vehicle is assigned to another area
                  const isAssigned = Object.values(assignedVehicles).some(
                    (assignedVehicle) =>
                      assignedVehicle && assignedVehicle._id === vehicle._id
                  );

                  return (
                    <div
                      key={vehicle._id}
                      className={`border border-gray-300 p-2 rounded-lg cursor-pointer hover:bg-gray-100
                        ${
                          vehicle.isAvailable === "Unavailable" || isAssigned
                            ? "bg-red-300 hover:bg-red-200"
                            : "bg-white"
                        }`}
                      onClick={() =>
                        vehicle.isAvailable === "Available" &&
                        !isAssigned &&
                        assignVehicleToArea(vehicle)
                      }
                    >
                      <h3 className="text-lg font-semibold">
                        ID: {vehicle.vehicleId}
                      </h3>
                      <p className="text-gray-600">
                        <span className="font-semibold">Vehicle Number:</span>{" "}
                        {vehicle.vehicleNumber}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Type:</span>{" "}
                        {vehicle.vehicleType}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">
                          Suitable Environment:
                        </span>{" "}
                        {vehicle.environment}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p>No vehicles found</p>
              )}
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={closeVehicleModal}
                className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Modal */}
      {showDriverModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-3/4 max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              Select a Driver for {selectedArea}
            </h2>

            {/* Driver Grid */}
            <div className="grid grid-cols-2 gap-4">
              {loading ? (
                <p>Loading drivers...</p>
              ) : drivers.length > 0 ? (
                drivers.map((driver) => {
                  // Check if the driver is already assigned to another area
                  const isAssigned = Object.values(assignedDrivers).some(
                    (assignedDriver) =>
                      assignedDriver && assignedDriver._id === driver._id
                  );

                  return (
                    <div
                      key={driver._id}
                      className={`border border-gray-300 p-2 rounded-lg cursor-pointer hover:bg-gray-100
                  ${
                    driver.isAvailable === "Unavailable" || isAssigned
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-white"
                  }`}
                      onClick={() => {
                        if (
                          driver.isAvailable !== "Unavailable" &&
                          !isAssigned
                        ) {
                          assignDriverToArea(driver);
                        }
                      }} >
                      <h3 className="text-lg font-semibold">ID: {driver.employeeId}</h3>
                      <p className="text-gray-600"><span className="font-semibold">Name:</span>{" "}{driver.name.firstName} {driver.name.lastName} </p>
                      <p className="text-gray-600"><span className="font-semibold">Position:</span>{" "} {driver.position} </p>
                    </div>
                  );
                })
              ) : (
                <p>No drivers found</p>
              )}
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={closeDriverModal}
                className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaAssignment;