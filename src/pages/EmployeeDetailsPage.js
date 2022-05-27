import { ORG_MAIN, TEAM_HEAD } from '../utils/constants';
import React, { useEffect, useState } from 'react';
import { deleteEmployee, getEmployeeById } from '../services/dataService';
import { useNavigate, useParams } from 'react-router-dom';

import { useHierarchy } from '../hooks/useHierarchy';

/**
 * Employee details page.
 * @returns EmployeeDetailsPage Component.
 */
export const EmployeeDetailsPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [employee, setEmployee] = useState(null);
  const [_hierarchy, _setHierarchy, reloadHierarchy, _filterHierarchy, appMessage, setAppMessage] =
    useHierarchy();
  let showListButton = employee && (employee.type === ORG_MAIN || employee.type === TEAM_HEAD);
  const showPromote = employee && employee.type !== ORG_MAIN;
  const showDelete = employee && employee.type !== ORG_MAIN;
  const [formMessage, setFormMessage] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await getEmployeeById(params.employeeId);
      if (response.status === 'error') {
        setFormMessage({ text: response.message, type: 'error' });
      } else {
        setFormMessage('');
        setEmployee(response.data);
      }
    })();
  }, [params]);

  const onRemoveEmployee = async () => {
    const response = await deleteEmployee(employee);

    if (response && response.status === 'error') {
      setFormMessage({ text: response.message, type: 'error' });
    } else {
      reloadHierarchy();
      navigate(`/`);
    }

    if (response.status === 'success') {
      setOriginalEmployee(null);
      setEmployee(null);
    }
  };

  if (formMessage) {
    return (
      <div className="container">
        <br></br>
        <div className="form-row row">
          {formMessage && (
            <label className={`${formMessage.type}-message`}>{formMessage.text}</label>
          )}
        </div>
      </div>
    );
  }

  if (!employee) {
    return <div>Loading...</div>;
  }

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
            <div className="column column-20">
              <button
                type="button"
                className="button button-small "
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
        <div className="column column-20">
          <button
            className="button button-small form-button"
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

        {showDelete && (
          <div className="column column-20">
            <button
              className="button button-small form-button"
              type="button"
              title="Delete Employee"
              onClick={onRemoveEmployee}
            >
              Delete
            </button>
          </div>
        )}

        {showListButton && (
          <>
            <div className="column column-20">
              <button
                className="button button-small button-outline form-button"
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
      <div className="form-row row">
        {formMessage && <label className={`${formMessage.type}-message`}>{formMessage.text}</label>}
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
