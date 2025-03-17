import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import axios from 'axios';
import { Line } from 'react-chartjs-2'; 
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register necessary components including Filler
ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler  
);

function VehicleAndDriversReport() {
    const reportRef = useRef();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredVehicles, setFilteredVehicles] = useState({});
    const [filteredDrivers, setFilteredDrivers] = useState({});
    const [drivers, setDrivers] = useState([]);


    // For Line Chart Data - Vehicls
    const [lineChartData, setLineChartData] = useState({
        labels: [], // X-axis labels
        datasets: [
            {
                label: 'Complete Tasks',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Incomplete Tasks',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
        ],
    });

    // For Line Chart Data (Drivers)
    const [driverLineChartData, setDriverLineChartData] = useState({
        labels: [], // X-axis labels
        datasets: [
            {
                label: 'Complete Tasks',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Incomplete Tasks',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
        ],
    });

    // Fetch assigned vehicles from API
    useEffect(() => {
        axios
            .get("http://localhost:8000/vehicleAssignments/assignall")
            .then((res) => {
                const vehicleData = res.data;
                setVehicles(vehicleData);
                filterByArea(vehicleData);
                setLoading(false);
                updateLineChartData(vehicleData);
            })
            .catch((err) => {
                console.error("Error fetching assigned vehicles:", err);
                setError(err.message || "An error occurred");
                setLoading(false);
            });
    }, []);

    const filterByArea = (vehicleData) => {
        const categorizedVehicles = vehicleData.reduce((acc, vehicle) => {
            const area = vehicle.area || "Uncategorized";
            const vehicleId = vehicle.vehicleId;

            if (!acc[area]) {
                acc[area] = {};
            }

            if (!acc[area][vehicleId]) {
                acc[area][vehicleId] = [];
            }

            acc[area][vehicleId].push(vehicle);
            return acc;
        }, {});
        setFilteredVehicles(categorizedVehicles);
    };

    const getTaskSummary = (vehicles) => {
        let totalComplete = 0;
        let totalIncomplete = 0;

        vehicles.forEach(vehicle => {
            if (vehicle.isComplete) {
                totalComplete += 1;
            } else {
                totalIncomplete += 1;
            }
        });

        return {
            totalComplete,
            totalIncomplete,
            totalTasks: vehicles.length
        };
    };


    // Update Line Chart Data
    const updateLineChartData = (vehicleData) => {
        const completeTasks = [];
        const incompleteTasks = [];
        const labels = [];

        vehicleData.forEach(vehicle => {
            const date = vehicle.dateAssigned ? new Date(vehicle.dateAssigned).toLocaleDateString() : new Date().toLocaleDateString();
            const totalComplete = vehicle.isComplete ? 1 : 0; 
            const totalIncomplete = vehicle.isComplete ? 0 : 1;

            if (!labels.includes(date)) {
                labels.push(date);
                completeTasks.push(totalComplete);
                incompleteTasks.push(totalIncomplete);
            } else {
                const index = labels.indexOf(date);
                completeTasks[index] += totalComplete;
                incompleteTasks[index] += totalIncomplete;
            }
        });

        setLineChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Complete Tasks',
                    data: completeTasks,
                    borderColor: '#03045E',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
                {
                    label: 'Incomplete Tasks',
                    data: incompleteTasks,
                    borderColor: '#F44027',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                },
            ],
        });
    };

    // Fetch assigned drivers from API
    useEffect(() => {
        axios
            .get("http://localhost:8000/driverAssignments/assignments")
            .then((res) => {
                const driverData = res.data;
                setDrivers(driverData);
                categorizeDriversByArea(driverData);
                setLoading(false);
                updateLineChartDataForDrivers(driverData)
            })
            .catch((err) => {
                console.error("Error fetching drivers:", err);
                setError(err.message || "An error occurred while fetching drivers");
                setLoading(false);
            });
    }, []);

    const categorizeDriversByArea = (driverData) => {
        const categorizedDrivers = driverData.reduce((acc, driver) => {
            const area = driver.area || "Uncategorized";
            const employeeId = driver.employeeId;

            if (!acc[area]) {
                acc[area] = {};
            }

            if (!acc[area][employeeId]) {
                acc[area][employeeId] = [];
            }

            acc[area][employeeId].push(driver);
            return acc;
        }, {});
        setFilteredDrivers(categorizedDrivers);
    };

    const calculateDriverSummary = (drivers) => {
        let totalComplete = 0;
        let totalIncomplete = 0;

        drivers.forEach(driver => {
            if (driver.isComplete) {
                totalComplete += 1;
            } else {
                totalIncomplete += 1;
            }
        });

        return {
            totalComplete,
            totalIncomplete,
            totalTasks: drivers.length
        };
    };

    const updateLineChartDataForDrivers = (driverData) => {
        const completeTasks = [];
        const incompleteTasks = [];
        const labels = [];

        driverData.forEach(driver => {
            const date = driver.dateAssigned ? new Date(driver.dateAssigned).toLocaleDateString() : new Date().toLocaleDateString();
            const totalComplete = driver.isComplete ? 1 : 0; 
            const totalIncomplete = driver.isComplete ? 0 : 1;

            if (!labels.includes(date)) {
                labels.push(date);
                completeTasks.push(totalComplete);
                incompleteTasks.push(totalIncomplete);
            } else {
                const index = labels.indexOf(date);
                completeTasks[index] += totalComplete;
                incompleteTasks[index] += totalIncomplete;
            }
        });
   
        setDriverLineChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Complete Tasks',
                    data: completeTasks,
                    borderColor: '#03045E',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
                {
                    label: 'Incomplete Tasks',
                    data: incompleteTasks,
                    borderColor: '#F44027',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                },
            ],
        });
    };


    const handlePrint = useReactToPrint({
        content: () => reportRef.current,
        onBeforeGetContent: () => {
            return Promise.resolve();
        },
        documentTitle: 'Vehicle and Drivers Report',
    });

    const handleDownloadPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        const content = reportRef.current;

        doc.setTextColor(0, 0, 0);

        doc.html(content, {
            callback: function (doc) {
                doc.save('vehicle-and-drivers-report.pdf');
            },
            x: 10,
            y: 10,
            html2canvas: {
                scale: 0.58,
                useCORS: true
            },
            margin: [10, 10, 10, 10],
            autoPaging: true,
            width: 1000,
            windowWidth: 950
        });
    };

    return (
      <div className="container mx-auto p-4 h-100vh">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">
            Vehicle and Drivers Progress Report
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Download as PDF
            </button>

            <button
              onClick={handlePrint}
              disabled={loading || error}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Print Report
            </button>
          </div>
        </div>

        
                    {/* Line Chart */}
            {/* Grid layout for two charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 mb-5">
                <div className="bg-white p-10 border rounded-lg mb-4 dark:bg-white">
                    <h3 className="text-lg font-bold text-black mb-2">Task Completion Trend In Vehicles</h3>
                    {!loading && lineChartData && <Line data={lineChartData} />}
                </div>

                <div className="bg-white p-10 border rounded-lg mb-4">
                    <h3 className="text-lg font-bold text-black mb-2">Task Completion Trend In Drivers</h3>
                    <Line data={driverLineChartData} />
                </div>
            </div>

        <div ref={reportRef} className="bg-white p-10 border rounded-lg">
          <header className="mb-5 border-b pb-3">
            <h2 className="text-xl font-semibold text-black">
              SuwaMihikatha: Garbage Collection System
            </h2>
            <p className="text-sm text-gray-800">
              Generated on: {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-800">
              Contact Us: SuwaMihikatha@gmail.com{" "}
            </p>
          </header>

          <main className="mb-5">
            <h3 className="text-lg font-bold text-black">
              Assigned Vehicles Information
            </h3>
            <p className="text-black text-justify">
              In this section, we provide a comprehensive overview of each
              vehicle's task completion status, highlighting their performance
              and efficiency in specific operational areas. This detailed report
              allows for effective tracking of progress and resource allocation,
              ensuring that all assignments are executed seamlessly within their
              designated regions.
            </p>

            {loading ? (
              <p>Loading vehicles...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : Object.keys(filteredVehicles).length > 0 ? (
              <table className="table-auto w-full mt-4">
                <thead className="bg-gray-400">
                  <tr className="font-semibold text-black text-center">
                    <th className="px-4 py-2">Area</th>
                    <th className="px-4 py-2">Vehicle ID</th>
                    <th className="px-4 py-2">Vehicle Number</th>
                    <th className="px-4 py-2">Complete Tasks</th>
                    <th className="px-4 py-2">Incomplete Tasks</th>
                    <th className="px-4 py-2">Total Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(filteredVehicles).map(
                    ([area, vehiclesInArea]) => (
                      <>
                        {Object.entries(vehiclesInArea).map(
                          ([vehicleId, vehicles], index) => {
                            const {
                              totalComplete,
                              totalIncomplete,
                              totalTasks,
                            } = getTaskSummary(vehicles);
                            return (
                              <tr key={`${area}-${vehicleId}`}>
                                {index === 0 && (
                                  <td
                                    className="border-3 px-4 py-2 text-black font-semibold border-black"
                                    rowSpan={Object.keys(vehiclesInArea).length}
                                  >
                                    {area}
                                  </td>
                                )}
                                <td className="border px-4 py-2 text-black border-2 text-center border-black">
                                  {vehicleId}
                                </td>
                                <td className="border px-4 py-2 text-black border-2 text-center border-black">
                                  {vehicles[0].vehicleNumber}
                                </td>
                                <td className="border px-4 py-2 text-black border-2 text-center border-black">
                                  {totalComplete}
                                </td>
                                <td className="border px-4 py-2 text-black border-2 text-center border-black">
                                  {totalIncomplete}
                                </td>
                                <td className="border px-4 py-2 text-black border-2 text-center border-black">
                                  {totalTasks}
                                </td>
                              </tr>
                            );
                          }
                        )}
                        <tr>
                          {" "}
                          <td
                            colSpan="6"
                            className="border-t-3 border-black"
                          ></td>
                        </tr>
                      </>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <p>No vehicles found.</p>
            )}

            <h3 className="text-lg font-bold text-black mt-5">
              Assigned Drivers Information
            </h3>
            <p className="text-black text-justify">
              In this section, we present a thorough assessment of each driver's
              task allocation and completion status, emphasizing their
              performance and efficiency across various operational areas. This
              detailed report facilitates effective monitoring of progress and
              resource utilization, ensuring that all assignments are carried
              out seamlessly within their designated regions. By highlighting
              key metrics related to task completion, we aim to enhance
              accountability and support strategic decision-making in driver
              management.
            </p>

            {loading ? (
              <p>Loading drivers...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : Object.keys(filteredDrivers).length > 0 ? (
              <table className="table-auto w-full mt-4">
                <thead className="bg-gray-400">
                  <tr className="font-semibold text-black text-center">
                    <th className="px-4 py-2">Area</th>
                    <th className="px-4 py-2">Employee ID</th>
                    <th className="px-4 py-2">Driver Name</th>
                    <th className="px-4 py-2">Complete Tasks</th>
                    <th className="px-4 py-2">Incomplete Tasks</th>
                    <th className="px-4 py-2">Total Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(filteredDrivers).map(
                    ([area, driversInArea]) => (
                      <>
                        {Object.entries(driversInArea).map(
                          ([employeeId, drivers], index) => {
                            const driverStats = calculateDriverSummary(drivers);
                            return (
                              <tr key={employeeId}>
                                {index === 0 && (
                                  <td
                                    className="border-3 px-4 py-2 text-black font-semibold border-black"
                                    rowSpan={Object.keys(driversInArea).length}
                                  >
                                    {area}
                                  </td>
                                )}
                                <td className="border px-4 py-2 text-black border-2 text-center border-black">
                                  {employeeId}
                                </td>
                                <td className="border px-4 py-2 text-black border-2 text-center border-black">
                                  {drivers[0].name.firstName}{" "}
                                  {drivers[0].name.lastName}
                                </td>
                                <td className="border px-4 py-2 text-black border-2 text-center border-black">
                                  {driverStats.totalComplete}
                                </td>
                                <td className="border px-4 py-2 text-black border-2 text-center border-black">
                                  {driverStats.totalIncomplete}
                                </td>
                                <td className="border px-4 py-2 text-black border-2 text-center border-black">
                                  {driverStats.totalTasks}
                                </td>
                              </tr>
                            );
                          }
                        )}
                        <tr>
                          <td
                            colSpan="6"
                            className="border-t-3 border-black"
                          ></td>
                        </tr>
                      </>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <p>No drivers found.</p>
            )}

          </main>

          <footer className="border-t pt-3">
            <p className="text-sm text-gray-500">
              © 2024 SuwaMihikatha Report System
            </p>
          </footer>
        </div>
      </div>
    );
}

export default VehicleAndDriversReport;
