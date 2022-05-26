import { EMAIL_VALIDATION_REGEX, PHONE_VALIDATION_REGEX } from '../utils/constants';
import React, { useEffect, useState } from 'react';
import { addEmployee, getTeamById } from '../services/dataService';
import { getEmptyEmployeeToAdd, hasNoErrors } from '../utils/utils';

import { useHierarchy } from '../hooks/useHierarchy';
import { useParams } from 'react-router-dom';

/**
 * Add new employee page.
 * @param {*} props
 * @returns EmployeeAddPage Component.
 */
export const EmployeeAddPage = () => {
  const params = useParams();
  const [_hierarchy, _setHierarchy, reloadHierarchy] = useHierarchy();
  const [errors, setErrors] = useState({});
  const emptyEmployee = getEmptyEmployeeToAdd();
  const [employee, setEmployee] = useState(emptyEmployee);
  const [parentTeam, setParentTeam] = useState(null);
  const [formMessage, setFormMessage] = useState(null);

  useEffect(() => {
    (async () => {
      let response = await getTeamById(params.teamId);
      setParentTeam(response.data);
    })();
  }, []);

  const onChangeEmployee = async (changes) => {
    setEmployee({ ...employee, ...changes });
  };

  const onAddEmployee = async () => {
    if (!isValidData(employee)) return;
    await addEmployee(employee, parentTeam._id);
    reloadHierarchy();
    setEmployee(getEmptyEmployeeToAdd());
  };

  const isValidData = (employee) => {
    let errors = {};
    if (!employee.name || employee.name.length < 3 || employee.name.length > 50) {
      errors.name = {
        message: 'Name is required to be min 3 & max 50 characters.',
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

  if (!parentTeam) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <h4 className="column form-title">Add New Team Member - {parentTeam.name}</h4>
      </div>
      <br></br>
      <div className="row">
        <div className="column column-20">
          <label className=" required">Name:</label>
        </div>
        <div className="column column-80">
          <input
            type="text"
            value={employee.name}
            name="name"
            onChange={(e) => {
              onChangeEmployee({ name: e.target.value });
            }}
            autoFocus
          />
          {errors.name && <label className="error-message">{errors.name.message}</label>}
        </div>
      </div>

      <div className="row">
        <div className="column column-20">
          <label className="required column-20">Email:</label>
        </div>
        <div className="column column-80">
          <input
            className="form-field column-60"
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
          <label className="required">Phone:</label>
        </div>
        <div className="column column-80">
          <input
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
          <label className="">Position:</label>
        </div>
        <div className="column column-80">
          <input
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
        <div className="column column-20 column-offset-20">
          <button
            className="form-button"
            type="button"
            title="Add New Employee"
            onClick={onAddEmployee}
          >
            Add
          </button>
        </div>
      </div>
      <div className="form-row row">
        {formMessage && <label className={`${formMessage.type}-message`}>{formMessage.text}</label>}
      </div>
    </div>
  );
};

export default EmployeeAddPage;
