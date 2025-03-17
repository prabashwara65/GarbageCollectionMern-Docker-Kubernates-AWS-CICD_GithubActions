import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Snackbar, Alert } from '@mui/material'; // Importing Snackbar and Alert from MUI
import DownloadIcon from '@mui/icons-material/Download'; // Importing Icon for the button
import { jsPDF } from 'jspdf';

function ComplaintsDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [expandedComplaintId, setExpandedComplaintId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State to hold Snackbar message

  // Function to fetch complaints data from the API using Axios
  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:8000/complain/allComplains');
      setComplaints(response.data); // Update the state with the fetched data
    } catch (error) {
      showSnackbar('Error fetching complaints'); // Show Snackbar on error
      console.error('Error fetching complaints:', error);
    }
  };

  // Fetch complaints data on component mount
  useEffect(() => {
    fetchComplaints();
  }, [complaints]); // Remove complaints dependency to avoid re-fetching on state change

  const updateComplaintStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:8000/complain/updateComplainStatus/${id}`, {
        status: newStatus // Send the new status as JSON
      });
      showSnackbar(`Complaint ${newStatus === "1" ? 'solved' : 'pending'} successfully!`); // Show success Snackbar
    } catch (error) {
      showSnackbar('Error updating complaint status'); // Show Snackbar on error
      console.error('Error updating complaint status:', error);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateComplaintStatus(id, newStatus); // Call the update function
    fetchComplaints(); // Fetch the updated complaints list
  };

  const toggleExpandedComplaint = (id) => {
    setExpandedComplaintId(expandedComplaintId === id ? null : id);
  };

  const pendingComplaintCountsByArea = complaints
    .filter(complaint => complaint.status === "0")
    .reduce((acc, complaint) => {
      acc[complaint.area] = (acc[complaint.area] || 0) + 1;
      return acc;
    }, {});

  // Function to show Snackbar
  const showSnackbar = (message) => {
    setSnackbarMessage(message); // Set the Snackbar message
    setSnackbarOpen(true); // Open the Snackbar
  };

  // Function to handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false); // Close the Snackbar
  };

  const handleDownload = (complaint, adminName) => {
    showSnackbar('Generating report...'); // Show Snackbar message
  
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    const appName = "Your App Name"; // Replace with your app name
    doc.text(appName, 160, 20); // Position on the right
    doc.text(`Admin: ${adminName}`, 20, 20); // Position on the left
  
    // Draw a line separator
    doc.line(20, 25, 190, 25); // Line from (20, 25) to (190, 25)
  
    // Add complaint details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Name: ${complaint.name}`, 20, 40);
    doc.text(`Date: ${new Date(complaint.createdAt).toLocaleDateString()}`, 20, 50);
    doc.text(`Email: ${complaint.email}`, 20, 60);
    doc.text(`Area: ${complaint.area}`, 20, 70);
    doc.text(`Status: ${complaint.status === "0" ? 'Pending' : 'Solved'}`, 20, 80);
    doc.text(`Complaint: ${complaint.complain}`, 20, 90);
  
    // Footer
    doc.setFontSize(10);
    doc.text("Created by Your App", 20, 270); // Footer text
    
    // Save the PDF
    doc.save(`Complaint_Report_${complaint._id}.pdf`);
    
    showSnackbar('Report generated successfully!'); // Show success Snackbar
  };

  // Function to handle the PDF download
  const handleGenerateReport = async () => {
    try {
      showSnackbar('Generating PDF report...');
      
      // Fetch the PDF from the backend
      // const response = await axios({
      //   url: 'http://localhost:8000/complain/generateReport', // Update the endpoint if necessary
      //   method: 'GET',
      //   responseType: 'blob' // Important for handling binary response
      // });

      const response = await axios.get('http://localhost:8000/complain/generateReport', {
        responseType: 'blob'
      });
      
      // Create a link element, set the URL using the response and click to trigger download
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'complaints_report.pdf'); // Name the file
      document.body.appendChild(link);
      link.click();
      
      // Remove link after downloading
      link.parentNode.removeChild(link);
      
      showSnackbar('PDF report generated successfully!');
    } catch (error) {
      showSnackbar('Error generating PDF report');
      console.error('Error generating PDF report:', error);
    }
  };
  

  return (
    <div>
      <h2 className="text-xl dark:text-white font-bold mt-4 ml-5">
        Complaints Dashboard
      </h2>

      {/* Display pending complaint count by area as cards */}
      <div className="flex flex-wrap justify-center m-3">
        {Object.keys(pendingComplaintCountsByArea).map((area) => (
          <div
            key={area}
            className="bg-white shadow-lg rounded-lg p-4 m-2 w-80 bg-opacity-50"
          >
            <h3 className="text-2xl font-bold mb-2 text-center">{area}</h3>
            <p className="text-lg font-semibold text-center">
              Pending Complaints: {pendingComplaintCountsByArea[area]}
            </p>
          </div>
        ))}
      </div>

      <div className=" bg-white bg-opacity-50 shadow-lg  mt-5 mr-5 ml-5">
        <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-700 dark:bg-gray-700">
                <th className="px-4 py-2 text-left text-white">Complaint ID</th>
                <th className="px-4 py-2 text-left text-white">Name</th>
                <th className="px-4 py-2 text-left text-white">Date</th>
                <th className="px-4 py-2 text-left text-white">Email</th>
                <th className="px-4 py-2 text-left text-white">Area</th>
                <th className="px-4 py-2 text-left text-white">Status</th>
                <th className="px-4 py-2 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint, index) => (
                <React.Fragment key={complaint.complaintId}>
                  <tr
                    className={index % 2 === 0 ? "bg-gray-200" : "bg-gray-400"}
                  >
                    <td className="px-4 py-2 text-black">{complaint.complaintId}</td>
                    <td className="px-4 py-2 text-black">{complaint.name}</td>
                    <td className="px-4 py-2 text-black">
                      {new Date(complaint.createdAt) .toISOString().substring(0, 10)}
                    </td>
                    <td className="px-4 py-2 text-black">{complaint.email}</td>
                    <td className="px-4 py-2 text-black">{complaint.area}</td>
                    <td className="px-4 py-2 text-black">
                      <select
                        value={complaint.status}
                        onChange={(e) =>
                          handleStatusChange(
                            complaint.complaintId,
                            e.target.value
                          )
                        }
                        className={`border rounded px-2 py-1 ${
                          complaint.status === "0"
                            ? "bg-red-400 "
                            : "bg-green-400 "
                        }`}
                      >
                        <option value="pending" className="text-black">
                          Pending
                        </option>
                        <option value="solved" className="text-black">
                          Solved
                        </option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() =>
                          toggleExpandedComplaint(complaint.complaintId)
                        }
                        className="bg-blue-500 text-white px-4 py-1 rounded-lg"
                      >
                        {expandedComplaintId === complaint.complaintId
                          ? "Hide Details"
                          : "More Details"}
                      </button>
                    </td>
                  </tr>

                  {/* Display additional details if the complaint is expanded */}
                  {expandedComplaintId === complaint.complaintId && (
                    <tr>
                      <td colSpan="7" className="px-4 py-2">
                        <div className="bg-white shadow-lg rounded-lg p-4 my-2">
                          <h3 className="text-xl font-bold mb-2">
                            Complaint Details
                          </h3>
                          <p><strong>Complaint ID:</strong>{" "}{complaint.complaintId}</p>
                          <p><strong>Name:</strong> {complaint.name}</p>
                          <p><strong>Date:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
                          <p><strong>Email:</strong> {complaint.email}</p>
                          <p><strong>Area:</strong> {complaint.area}</p>
                          <p><strong>Status:</strong> {complaint.status}</p>

                          <div className="mt-4">
                            <label
                              htmlFor="answer"
                              className="block text-lg font-semibold mb-2"
                            >
                              Answer:
                            </label>
                            <input
                              id="answer"
                              type="text"
                              value={complaint.answer}
                              onChange={(e) =>
                                handleAnswerChange(
                                  complaint.complaintId,
                                  e.target.value
                                )
                              }
                              className="border rounded px-4 py-2 w-full"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ComplaintsDashboard;
