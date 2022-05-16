import React, { useEffect, useState } from 'react';

import { getTeamMembersData } from '../services/dataService';
import { useParams } from 'react-router-dom';

const TeamMebmersListPage = () => {
  let params = useParams();
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    (async () => {
      const teamMembers = getTeamMembersData(params.id);
      setEmployees(teamMembers);
    })();
  }, []);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => {
            return (
              <tr key={e._id}>
                <td>{e._id}</td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.phone}</td>
                <td>{e.position}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TeamMebmersListPage;
