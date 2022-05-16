import { EMAIL_VALIDATION_REGEX, PHONE_VALIDATION_REGEX } from '../utils/constants';
import React, { useEffect, useState } from 'react';

import { getAllowedTeams } from '../services/dataService';
import { hasNoErrors } from '../utils/utils';
import { useHierarchy } from '../hooks/useHierarchy';
import { useNavigate } from 'react-router-dom';

export const EmployeeEditPage = ({
  employee,
  onChangeEmployee,
  onResetEmployee,
  onSaveEmployee,
  onPromoteEmployee,
  onMoveEmployee,
  onRemoveEmployee,
}) => {
  const [_hierarchy, setHierarchy, reloadHierarchy] = useHierarchy();
  const [errors, setErrors] = useState({});
  const [moveTeamError, setMoveTeamError] = useState({});
  const [formMessage, setFormMessage] = useState(null);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [newTeamId, setNewTeamId] = useState(null);
  const showPromote = employee.type !== 'main';
  const showDelete = employee.type !== 'main';

  let navigate = useNavigate();

  useEffect(() => {
    isValidData(employee);
    (async () => {
      let allowedTeams = await getAllowedTeams(employee._id);
      setFilteredTeams(allowedTeams);
    })();
  }, [employee]);

  const isValidData = (employee) => {
    let errors = {};
    if (!employee.name || employee.name.length < 3 || employee.name.length > 50) {
      errors.name = {
        message: 'Name is required and should be min 3 and max 50 characters long.',
      };
    }

    if (!employee.email && employee.email.match(EMAIL_VALIDATION_REGEX)) {
      errors.email = {
        message: 'A valid email is required.',
      };
    }

    if (!employee.phone && employee.phone.match(PHONE_VALIDATION_REGEX)) {
      errors.phone = {
        message: 'A phone number in +XX XXXXX XXXXX format is required.',
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

  return (
    <>
      <div className="continer">
        <div className="row">
          <h4 id="employee-id" className="form-field form-title">
            ID: {employee._id}
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
        <div className="row">
          <div className="column">
            <button
              className="form-button"
              type="button"
              title="Save Employee Details"
              onClick={(e) => {
                // Check for field validations return on failure
                if (!isValidData(employee)) return;

                const response = onSaveEmployee(employee);
                reloadHierarchy();
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
                    if (response && response.data === 'error') {
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
            <label className={`${formMessage.type}-message`}>{formMessage.text}</label>
          )}
        </div>
      </div>
      <br></br>
      {employee.type === 'member' && (
        <div className="container">
          <div className="row">
            <h4 id="employee-id" className="form-field form-title">
              Move to Another Team
            </h4>
          </div>
          <div className="row">
            <div className="column column-10">
              <label className="form-label">To:</label>
            </div>
            <div className="column column-70">
              <select
                style={{ width: 250, marginRight: 10 }}
                onChange={(e) => {
                  setNewTeamId(e.target.value);
                }}
              >
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
                      text: 'Please select a team from doropdown.',
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