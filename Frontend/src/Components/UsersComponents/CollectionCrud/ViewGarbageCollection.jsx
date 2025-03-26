import React, { useState, useEffect } from "react";
import axios from "axios";

// Function to send a confirmation email
const sendEmail = (email, _id) => {
  axios
    .post("http://localhost:4000/users/send-confirmation", { email, _id })
    .then((response) => {
      alert("Message sent!");
    })
    .catch((err) => {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    });
};

function GarbageCollectionList() {
  const [GarbageCollection, setGarbageCollectionList] = useState([]);
  const [filteredCollection, setFilteredCollection] = useState([]);
  const [selectedArea, setSelectedArea] = useState("All");
  const [countdown, setCountdown] = useState(0); // Countdown timer in seconds
  const [isCounting, setIsCounting] = useState(false); // State to track if the countdown is active

  useEffect(() => {
    axios
      .get("http://localhost:4000/register/ViewUsers")
      .then((res) => {
        setGarbageCollectionList(res.data);
        setFilteredCollection(res.data); // Initialize the filtered collection
      })
      .catch((err) => console.log(err));

    // Cleanup timer on unmount
    return () => clearInterval();
  }, []);

  // Function to start countdown
  const startCountdown = (duration) => {
    setCountdown(duration);
    setIsCounting(true);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          resetCollectionStatus(); // Call the reset function when countdown ends
          setIsCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Filter based on selected area
  const handleAreaChange = (e) => {
    const area = e.target.value;
    setSelectedArea(area);

    if (area === "All") {
      setFilteredCollection(GarbageCollection);
    } else {
      setFilteredCollection(
        GarbageCollection.filter((collector) => collector.area === area)
      );
    }
  };

  // Reset all collection statuses
  const resetCollectionStatus = async () => {
    try {
      await axios.put("http://localhost:4000/register/reset-collection-status");
      alert("All collection statuses have been reset to not_collected.");
      // Optionally, you can re-fetch the collection data here
      const res = await axios.get("http://localhost:4000/register/ViewUsers");
      setGarbageCollectionList(res.data);
      setFilteredCollection(res.data);
    } catch (error) {
      console.error("Error resetting collection statuses:", error);
      alert("Failed to reset collection statuses.");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          View Garbage Collection List
        </h1>

        {/* Area Filter */}
        <div className="flex justify-end">
          <select
            className="border border-gray-300 rounded-lg p-2"
            value={selectedArea}
            onChange={handleAreaChange}
          >
            <option value="All">All Areas</option>
            <option value="Area 1">Area 1</option>
            <option value="Area 2">Area 2</option>
            <option value="Area 3">Area 3</option>
          </select>
        </div>

        <div className="flex gap-4 items-end ">
          
          {/* Countdown Timer */}
          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold">
              {isCounting ? (
                <>
                  Time until reset: {Math.floor(countdown / 60)}:
                  {("0" + (countdown % 60)).slice(-2)}
                </>
              ) : (
                <>Ready to reset</>
              )}
            </h2>
          </div>

          {/* Active Database Trigger Button */}
          <div className="mb-4 text-center">
            <button
              onClick={() => startCountdown(50)} // Start countdown for 100 seconds
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
              disabled={isCounting} // Disable if countdown is active
            >
              Active Database Trigger
            </button>
          </div>

          {/* Reset Button */}
          <div className="mb-4 text-center">
            <button
              onClick={resetCollectionStatus}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Reset Collection Status
            </button>
          </div>
        </div>

        {/* Add overflow and max height for scrolling */}
        <div className="overflow-y-auto max-h-96">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-gray-700">Name</th>
                <th className="py-3 px-4 text-left text-gray-700">Email</th>
                <th className="py-3 px-4 text-left text-gray-700">Area</th>
                <th className="py-3 px-4 text-left text-gray-700">
                  isCollected
                </th>
                <th className="py-3 px-4 text-left text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCollection.map((GarbageCollector, index) => (
                <tr
                  key={index}
                  className="text-center border-b hover:bg-gray-100"
                >
                  <td className="py-3 px-4">{GarbageCollector.name}</td>
                  <td className="py-3 px-4">{GarbageCollector.email}</td>
                  <td className="py-3 px-4">{GarbageCollector.area}</td>
                  <td className="py-3 px-4">{GarbageCollector.iscollected}</td>
                  <td className="py-3 px-4 flex justify-around">
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                      onClick={() =>
                        sendEmail(GarbageCollector.email, GarbageCollector._id)
                      }
                    >
                      Send Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GarbageCollectionList;
