import React, { useEffect, useState } from 'react';
import { deleteEmployee, getEmployeeById, updateEmployee } from '../services/dataService';

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

/**
 * This is HOC to return the Employee edit and show components for a given employee id along with the
 * change, save, delete, reset methods to be used by the component passed to it.
 **/
const withEditableEmployee = (Component, employeeId) => {
  return (props) => {
    const [originalEmployee, setOriginalEmployee] = useState(null);
    const [employee, setEmployee] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
      (async () => {
        const response = await getEmployeeById(employeeId);
        setOriginalEmployee(response.data);
        setEmployee(response.data);
      })();
    }, []);

    const onChangeEmployee = async (changes) => {
      setEmployee({ ...employee, ...changes });
    };

    const onResetEmployee = async () => {
      setEmployee(originalEmployee);
    };

    const onSaveEmployee = async () => {
      const response = await updateEmployee(employee);
      setOriginalEmployee(response.data);
      setEmployee(response.data);

      return response;
    };

    const onRemoveEmployee = async () => {
      const response = await deleteEmployee(employee);

      if (response.data === 'success') {
        setOriginalEmployee(null);
        setEmployee(null);
        // TOOD: show success message
        navigate(`/`);
      } else {
        return response;
      }
    };

    return (
      <Component
        {...props}
        employee={employee}
        onChangeEmployee={onChangeEmployee}
        onResetEmployee={onResetEmployee}
        onSaveEmployee={onSaveEmployee}
        onRemoveEmployee={onRemoveEmployee}
      />
    );
  };
};

withEditableEmployee.propTypes = {
  Component: PropTypes.object,
  employeeId: PropTypes.string,
};

export default withEditableEmployee;
