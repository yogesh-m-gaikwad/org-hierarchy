import React from 'react';
import { useNavigate } from 'react-router-dom';

export const EmployeeDetailsPage = ({ employee }) => {
  let navigate = useNavigate();
  let showListButton = employee.type === 'main' || employee.type === 'head';
  return (
    <div className="container">
      <div className="row">
        <h4 className="form-title">Employee Information</h4>
      </div>
      <div>
        <p>ID: {employee._id}</p>
        <p>Name: {employee.name}</p>
        <p>Position: {employee.position}</p>
        <p>Email: {employee.email}</p>
        <p>Phone: {employee.phone}</p>
      </div>
      <div className="row">
        {employee.type === 'head' && (
          <div className="column column-40">
            <button
              type="primary"
              onClick={(e) => {
                navigate(`/add/team/${employee._id}`, {
                  state: { employee },
                  replace: false,
                });
              }}
            >
              Add New Team
            </button>
          </div>
        )}
        {showListButton && (
          <div className="column column-40">
            <button
              className="form-button"
              type="primary"
              onClick={(e) => {
                navigate(`/team/list/${employee._id}`, {
                  state: { employee },
                  replace: false,
                });
              }}
            >
              Employees List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
