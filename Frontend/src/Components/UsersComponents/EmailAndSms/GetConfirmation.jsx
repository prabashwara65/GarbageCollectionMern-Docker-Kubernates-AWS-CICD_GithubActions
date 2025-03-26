import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const GetConfirmUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Extracting the user ID from the URL
  const [iscollected, setIsCollected] = useState(""); // To track iscollected state
  const [userRecordId, setUserRecordId] = useState(id); // Set the user record ID from the URL

  // Fetch garbage collection record for the user
  useEffect(() => {
    axios
      .get(`http://localhost:4000/register/ViewUsers/${userRecordId}`) // Fetch record using user ID
      .then((res) => {
        const userRecord = res.data;
        if (userRecord) {
          setIsCollected(userRecord.iscollected); // Pre-fill with existing value if needed
        } else {
          console.log("No matching record found for the user");
        }
      })
      .catch((err) => console.log(err));
  }, [userRecordId]);

  const handleConfirmation = async () => {
    if (!userRecordId) {
      alert("User record not found, cannot update.");
      return;
    }

    try {
      // Log the data being sent to the server
      console.log("Updating collection status for:", userRecordId, { iscollected });

      // Make the API request to update the collection status
      await axios.put(
        `http://localhost:4000/register/UpdateUsers/${userRecordId}`,
        { iscollected } // Update with the current iscollected state
      );
      alert("Collection status updated successfully");
      window.close();

      
      
    } catch (error) {
      console.error("Error updating status:", error.response ? error.response.data : error);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-700">
          Confirm Garbage Collection Status
        </h1>

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

        {/* Confirm Button */}
        <div className="mt-6">
          <button
            onClick={handleConfirmation}
            className="w-full py-2 text-white bg-indigo-500 hover:bg-indigo-600 rounded-md focus:outline-none"
            disabled={!userRecordId} // Disable if userRecordId is not found
          >
            Confirm Collection Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetConfirmUpdate;
