import { EMAIL_VALIDATION_REGEX, PHONE_VALIDATION_REGEX } from '../utils/constants';
import React, { useEffect, useState } from 'react';
import { addEmployee, getTeamById, hasTeamLeader } from '../services/dataService';
import { getEmptyEmployeeToAdd, hasNoErrors } from '../utils/utils';

import { useHierarchy } from '../hooks/useHierarchy';
import { useParams } from 'react-router-dom';

/**
 * Add new employee page.
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
    if (params.teamId) {
      (async () => {
        let response = await getTeamById(params.teamId);
        let parentTeam = response.data;
        setParentTeam(parentTeam);
      })();
    }
  }, [params]);

  useEffect(() => {
    (async () => {
      let teamLeaderIsPresent = await hasTeamLeader(parentTeam._id);
      if (!teamLeaderIsPresent) {
        setEmployee({ ...employee, position: 'Team Leader' });
      }
    })();
  }, [parentTeam]);

  useEffect(() => {
    let timer;
    timer = setTimeout(() => {
      setFormMessage('');
    }, 2500);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [formMessage]);

  const onChangeEmployee = async (changes) => {
    setEmployee({ ...employee, ...changes });
  };

  const onAddEmployee = async () => {
    if (!isValidData(employee)) return;
    let response = await addEmployee(employee, parentTeam._id);

    if (response && response.status === 'error') {
      setFormMessage({ text: response.message, type: 'error' });
      setEmployee(employee);
    }

    if (response.status === 'success') {
      reloadHierarchy();
      setEmployee(getEmptyEmployeeToAdd());
    }
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
            className="button button-small form-button"
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
