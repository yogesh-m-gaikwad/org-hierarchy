import {
  EMAIL_VALIDATION_REGEX,
  ORG_MAIN,
  PHONE_VALIDATION_REGEX,
  TEAM_MEMBER,
} from '../utils/constants';
import React, { useEffect, useState } from 'react';
import {
  deleteEmployee,
  getAllowedTeams,
  getEmployeeById,
  moveEmployee,
  promoteEmployee,
  updateEmployee,
} from '../services/dataService';
import { useNavigate, useParams } from 'react-router-dom';

import { hasNoErrors } from '../utils/utils';
import { useHierarchy } from '../hooks/useHierarchy';

/**
 * Edit employee details page.
 * @param {*} props
 * @returns EmployeeEditPage Component.
 */
export const EmployeeEditPage = () => {
  const [_hierarchy, _setHierarchy, reloadHierarchy, _filterHierarchy, appMessage, setAppMessage] =
    useHierarchy();
  let navigate = useNavigate();
  const params = useParams();
  const [originalEmployee, setOriginalEmployee] = useState(null);
  const [employee, setEmployee] = useState(null);

  const [errors, setErrors] = useState({});
  const [moveTeamError, setMoveTeamError] = useState({});
  const [formMessage, setFormMessage] = useState(null);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [newTeamId, setNewTeamId] = useState(null);

  const showPromote = employee && employee.type !== ORG_MAIN;
  const showDelete = employee && employee.type !== ORG_MAIN;

  useEffect(() => {
    (async () => {
      console.log('params.employeeId:' + params.employeeId);
      if (params.employeeId) {
        const response = await getEmployeeById(params.employeeId);
        setOriginalEmployee(response.data);
        setEmployee(response.data);
      }
    })();
  }, []);

  const onResetEmployee = async () => {
    setEmployee(originalEmployee);
  };

  const onSaveEmployee = async () => {
    const response = await updateEmployee(employee);
    setOriginalEmployee(response.data);
    setEmployee(response.data);
    return response;
  };

  const onMoveEmployee = async (newTeamId) => {
    const response = await moveEmployee(employee, newTeamId);
    setOriginalEmployee(response.data);
    setEmployee(response.data);
    return response;
  };

  const onPromoteEmployee = async () => {
    const response = await promoteEmployee(employee);
    setOriginalEmployee(response.data);
    setEmployee(response.data);
    return response;
  };

  const onRemoveEmployee = async () => {
    const response = await deleteEmployee(employee);

    if (response.status === 'success') {
      setOriginalEmployee(null);
      setEmployee(null);
      // TODO: show success message
      return response;
    } else {
      return response;
    }
  };

  const onChangeEmployee = async (changes) => {
    setEmployee({ ...employee, ...changes });
  };

  useEffect(() => {
    let timer;
    timer = setTimeout(() => {
      setAppMessage('');
    }, 2500);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [appMessage]);

  useEffect(() => {
    if (employee) {
      isValidData(employee);
      (async () => {
        let allowedTeams = await getAllowedTeams(employee._id);
        setFilteredTeams(allowedTeams);
      })();
    }
  }, [employee]);

  const isValidData = (employee) => {
    let errors = {};
    if (!employee.name || employee.name.length < 3 || employee.name.length > 50) {
      errors.name = {
        message: 'Name is required and should be min 3 and max 50 characters long.',
      };
    }

    if (!employee.email || !employee.email.match(EMAIL_VALIDATION_REGEX)) {
      errors.email = {
        message: 'A valid email is required.',
      };
    }

    if (!employee.phone || !employee.phone.match(PHONE_VALIDATION_REGEX)) {
      errors.phone = {
        message: 'A phone number in [+]XXXXXXXXXXXX format is required.',
      };
    }

    if (!employee.position || employee.position.length < 3 || employee.position.length > 50) {
      errors.position = {
        message: 'Position text is required min 3 & max 50 characters.',
      };
    }

    if (hasNoErrors(errors)) {
      setErrors({});
      return true;
    } else {
      setErrors(errors);
      return false;
    }
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <h4 id="employee-id" className="form-field form-title">
            Employee ID: <span style={{ color: '#9b4dca' }}>{employee._id}</span>
          </h4>
        </div>
        <div className="row">
          <div className="column column-20">
            <label className="form-label required">Name:</label>
          </div>
          <div className="column column-80">
            <input
              className="form-field"
              type="text"
              value={employee.name}
              name="name"
              onChange={(e) => {
                onChangeEmployee({ name: e.target.value });
              }}
            />
            {errors.name && <label className="error-message">{errors.name.message}</label>}
          </div>
        </div>
        <div className="row">
          <div className="column column-20">
            <label className="form-label required">Email:</label>
          </div>
          <div className="column column-80">
            <input
              className="form-field"
              type="text"
              value={employee.email}
              name="email"
              onChange={(e) => {
                onChangeEmployee({ email: e.target.value });
              }}
            />
            {errors.email && <label className="error-message">{errors.email.message}</label>}
          </div>
        </div>
        <div className="row">
          <div className="column column-20">
            <label className="form-label required">Phone:</label>
          </div>
          <div className="column column-80">
            <input
              className="form-field"
              type="text"
              value={employee.phone}
              name="phone"
              onChange={(e) => {
                onChangeEmployee({ phone: e.target.value });
              }}
            />
            {errors.phone && <label className="error-message">{errors.phone.message}</label>}
          </div>
        </div>
        <div className="row">
          <div className="column column-20">
            <label className="form-label">Position:</label>
          </div>
          <div className="column column-80">
            <input
              className="form-field"
              type="text"
              value={employee.position}
              name="position"
              onChange={(e) => {
                onChangeEmployee({ position: e.target.value });
              }}
            ></input>
            {errors.position && <label className="error-message">{errors.position.message}</label>}
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="column">
            <button
              className="form-button"
              type="button"
              title="Save Employee Details"
              onClick={(e) => {
                // Check for field validations return on failure
                if (!isValidData(employee)) return;

                onSaveEmployee(employee).then((response) => {
                  reloadHierarchy();
                  if (response && response.status === 'success') {
                    setAppMessage({ text: response.message, type: 'success' });
                  }
                });
              }}
            >
              Save
            </button>
            <button
              className="button button-outline form-button"
              type="button"
              title="Reset Edits"
              onClick={(e) => {
                onResetEmployee();
              }}
            >
              Reset
            </button>
            {showPromote && (
              <button
                className="form-button"
                type="button"
                title="Promote to Next Level"
                onClick={(e) => {
                  // Check for field validations return on failure
                  if (!isValidData(employee)) return;

                  onPromoteEmployee(employee).then((response) => {
                    reloadHierarchy();
                    if (response && response.status === 'success') {
                      setFormMessage({ text: response.message, type: 'success' });
                    }
                  });
                }}
              >
                Promote
              </button>
            )}
            {showDelete && (
              <button
                className="form-button"
                type="button"
                title="Delete Employee"
                onClick={(e) => {
                  onRemoveEmployee(employee).then((response) => {
                    if (response && response.status === 'error') {
                      setFormMessage({ text: response.message, type: 'error' });
                    } else {
                      reloadHierarchy();
                      navigate(`/`);
                    }
                  });
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <div className="row">
          {formMessage && (
            <label className={`${formMessage.type}-message form-message`}>{formMessage.text}</label>
          )}

          {appMessage && (
            <label className={`${appMessage.type}-message form-message`}>{appMessage.text}</label>
          )}
        </div>
      </div>
      <br></br>
      {employee.type === TEAM_MEMBER && (
        <div className="container">
          <div className="row">
            <h4 id="employee-id" className="form-field form-title">
              Move to Another Team
            </h4>
          </div>
          <div className="row">
            <div className="column column-10">
              <label className="form-label">Team:</label>
            </div>
            <div className="column column-70">
              <select
                placeholder="Please select a Team"
                style={{ width: 350, marginRight: 10 }}
                onChange={(e) => {
                  setNewTeamId(e.target.value);
                }}
              >
                <option key="default" value="">
                  Please select a team
                </option>
                {filteredTeams.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.teamName}
                  </option>
                ))}
              </select>
            </div>
            <div className="column column-25">
              <button
                className="form-button"
                type="button"
                title="Move Employee"
                onClick={(e) => {
                  if (newTeamId) {
                    onMoveEmployee(newTeamId);
                    reloadHierarchy();
                  } else {
                    setMoveTeamError({
                      text: 'Please select a team from dropdown.',
                      type: 'error',
                    });
                  }
                }}
              >
                Move
              </button>
            </div>
          </div>
          <div className="row">
            {moveTeamError && (
              <label className={`${moveTeamError.type}-message`}>{moveTeamError.text}</label>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeEditPage;
