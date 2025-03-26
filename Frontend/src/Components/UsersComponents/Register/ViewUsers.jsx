import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/register/ViewUsers")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Function to handle user deletion
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:4000/register/ViewUsers/${id}`)
        .then((res) => {
          alert("User deleted successfully!");
          setUsers(users.filter((user) => user._id !== id)); // Update state to remove deleted user
        })
        .catch((err) => console.error("Error deleting user:", err));
    }
  };

  // Function to handle user update (this is just a placeholder for now)
  const handleUpdate = (id) => {
    // You can redirect to an update form or show a modal for updating
    console.log("Update user with id:", id);
    // You can redirect to a form for updating, or manage it inline
    // Example: navigate to a page with update form `/update-user/${id}`
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          User List
        </h1>
        <table className="min-w-full bg-white rounded-md shadow overflow-hidden">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Area</th>
              <th className="py-3 px-6">Phone</th>
              <th className="py-3 px-6">Password</th>
              <th className="py-3 px-6">iscollected</th>
              <th className="py-3 px-6">Actions</th> {/* New Actions column */}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className="text-center border-b hover:bg-gray-100"
              >
                <td className="py-3 px-6">{user.name}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">{user.area}</td>
                <td className="py-3 px-6">{user.phone}</td>
                <td className="py-3 px-6 text-gray-500 italic">[Hashed]</td>
                <td className="py-3 px-6">{user.iscollected}</td>
                <td className="py-3 px-6 flex justify-center space-x-4">
                  {/* Update Button */}
                  <Link to={`/UpdateUsers/${user._id}`}>
                    <button className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200">
                      Update
                    </button>
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
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

export default UserList;
