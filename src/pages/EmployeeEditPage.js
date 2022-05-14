import { Button, Card, Input } from 'antd';
import React, { useEffect, useState } from 'react';

import { hasNoErrors } from '../utils/utils';
import { useHierarchy } from '../hooks/useHierarchy';

export const EmployeeEditPage = ({
  employee,
  onChangeEmployee,
  onResetEmployee,
  onSaveEmployee,
  onRemoveEmployee,
}) => {
  const [_hierarchy, setHierarchy, reloadHierarchy] = useHierarchy();
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState(null);

  useEffect(() => {
    isValidData(employee);
  }, [employee]);

  const isValidData = (employee) => {
    let errors = {};
    if (!employee.name || employee.name.length < 3 || employee.name.length > 50) {
      errors.name = {
        message: 'Name is required and should be min 3 and max 50 characters long.',
      };
    }

    if (!employee.email) {
      errors.email = {
        message: 'Email is required.',
      };
    }

    if (!employee.phone) {
      errors.phone = {
        message: 'Phone is required.',
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
    <Card>
      <div className="form-row">
        <label className="form-label">ID:</label>
        <label id="employee-id" className="form-field">
          {employee._id}
        </label>
      </div>
      <div className="form-row">
        <label className="form-label required">Name:</label>
        <Input
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
      <div className="form-row">
        <label className="form-label required">Email:</label>
        <Input
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
      <div className="form-row">
        <label className="form-label required">Phone:</label>
        <Input
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
      <div className="form-row">
        <Button
          className="form-button"
          type="primary"
          onClick={(e) => {
            // Check for field validations return on failure
            if (!isValidData(employee)) return;

            const response = onSaveEmployee(employee);
            reloadHierarchy();
          }}
        >
          Save
        </Button>
        <Button
          className="form-button"
          type="primary"
          onClick={(e) => {
            onResetEmployee();
          }}
        >
          Reset
        </Button>
        <Button
          className="form-button"
          type="danger"
          onClick={(e) => {
            onRemoveEmployee(employee).then((response) => {
              if (response.data === 'error') {
                setFormMessage({ text: response.message, type: 'error' });
              } else {
                reloadHierarchy();
              }
            });
          }}
        >
          Delete
        </Button>
      </div>
      <div className="form-row">
        {formMessage && <label className={`${formMessage.type}-message`}>{formMessage.text}</label>}
      </div>
    </Card>
  );
};

export default EmployeeEditPage;
