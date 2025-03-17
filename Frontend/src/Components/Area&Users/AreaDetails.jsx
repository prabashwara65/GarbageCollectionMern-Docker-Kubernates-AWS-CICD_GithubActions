import React from 'react';
import { useParams } from 'react-router-dom';

const AreaDetails = ({ users }) => {
  const { area } = useParams();

  const filteredUsers = users.filter(user => user.area === area);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold">Details for {area}</h2>
      <ul>
        {filteredUsers.map((user, index) => (
          <li key={index}>
            {user.name} - Status: {user.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AreaDetails;
