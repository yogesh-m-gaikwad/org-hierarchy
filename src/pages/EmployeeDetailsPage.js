import { ORG_MAIN, TEAM_HEAD } from '../utils/constants';

import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Employee details page.
 * @param {*} props
 * @returns EmployeeDetailsPage Component.
 */
export const EmployeeDetailsPage = ({ employee }) => {
  let navigate = useNavigate();
  let showListButton = employee.type === ORG_MAIN || employee.type === TEAM_HEAD;

  return (
    <div className="container">
      <div className="row">
        <h4 className="form-title">Employee Information</h4>
      </div>
      <div>
        <div className="row">
          <div className="column column-20 title">ID:</div>
          <div className="column column-80">{employee._id}</div>
        </div>
        <div className="row">
          <div className="column column-20 title">Name:</div>
          <div className="column column-80">{employee.name}</div>
        </div>
        <div className="row">
          <div className="column column-20 title">Position:</div>
          <div className="column column-80">{employee.position}</div>
        </div>
        <div className="row">
          <div className="column column-20 title">Email:</div>
          <div className="column column-80">{employee.email}</div>
        </div>
        <div className="row">
          <div className="column column-20 title">Phone:</div>
          <div className="column column-80">{employee.phone}</div>
        </div>
      </div>
      <br></br>
      <div className="row">
        {employee.type === TEAM_HEAD && (
          <>
            <div className="column column-33">
              <button
                type="button"
                className="button"
                title="Add New Team"
                onClick={(e) => {
                  navigate(`/add/team/${employee._id}`, {
                    state: { employee },
                    replace: false,
                  });
                }}
              >
                New Team
              </button>
            </div>
          </>
        )}
        <div className="column column-25">
          <button
            className="form-button"
            type="button"
            title="Edit Employee"
            onClick={(e) => {
              // send blank employee in state to allow for add page load
              navigate(`/edit/employee/${employee._id}`, {
                state: { employee },
                replace: false,
              });
            }}
          >
            Edit
          </button>
        </div>
        {showListButton && (
          <>
            <div className="column column-33">
              <button
                className="button button-outline form-button"
                type="button"
                title="Show Employee List"
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
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
