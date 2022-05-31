import React, { useEffect, useState } from 'react';
import { getEmployeeById, getTeamMembersData } from '../services/dataService';

import { useParams } from 'react-router-dom';

/**
 * List of team members page.
 * @returns TeamMembersListPage Component.
 */
const TeamMembersListPage = () => {
  let params = useParams();
  const [employees, setEmployees] = useState([]);
  const [pageTitle, setPageTitle] = useState([]);
  useEffect(() => {
    (async () => {
      const teamMembers = getTeamMembersData(params.id);
      const response = await getEmployeeById(params.id);
      const employee = response.data;
      setPageTitle(`Employees List - ${employee.name} (${employee.position})`);
      setEmployees(teamMembers);
    })();
  }, []);

  return (
    <>
      <div>
        <h4>{pageTitle}</h4>
      </div>
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

export default TeamMembersListPage;
