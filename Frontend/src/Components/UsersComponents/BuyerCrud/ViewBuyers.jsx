import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function BuyerList() {
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/buyer/ViewBuyers")
      .then((res) => {
        setBuyers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8000/buyer/BuyerDelete/" + id)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Buyer List
        </h1>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-700">Name</th>
              <th className="py-3 px-4 text-left text-gray-700">Email</th>
              <th className="py-3 px-4 text-left text-gray-700">Phone</th>
              <th className="py-3 px-4 text-left text-gray-700">Password</th>
              <th className="py-3 px-4 text-left text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((buyer, index) => (
              <tr
                key={index}
                className="text-center border-b hover:bg-gray-100"
              >
                <td className="py-3 px-4">{buyer.name}</td>
                <td className="py-3 px-4">{buyer.email}</td>
                <td className="py-3 px-4">{buyer.phone}</td>
                <td className="py-3 px-4">{buyer.password}</td>
                <td className="py-3 px-4 flex justify-around">
                  <Link to={`/BuyerUpdate/${buyer._id}`}>
                    <button className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200">
                      Update
                    </button>
                  </Link>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                    onClick={(e) => handleDelete(buyer._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BuyerList;
