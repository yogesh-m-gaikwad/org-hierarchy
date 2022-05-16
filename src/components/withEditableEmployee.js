import React, { useEffect, useState } from 'react';
import {
  addEmployee,
  deleteEmployee,
  getEmployeeById,
  getTeamById,
  moveEmployee,
  promoteEmployee,
  updateEmployee,
} from '../services/dataService';

import PropTypes from 'prop-types';
import { getEmptyEmployeeToAdd } from '../utils/utils';

/**
 * This is HOC to return the Employee edit and show components for a given employee id along with the
 * change, save, delete, reset methods to be used by the component passed to it.
 **/
const withEditableEmployee = (Component, employeeId, teamId) => {
  return (props) => {
    const [originalEmployee, setOriginalEmployee] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [parentTeam, setParentTeam] = useState(null);

    useEffect(() => {
      (async () => {
        if (employeeId) {
          const response = await getEmployeeById(employeeId);
          setOriginalEmployee(response.data);
          setEmployee(response.data);
        }
        if (teamId) {
          const response = await getTeamById(teamId);
          setParentTeam(response.data);
          setEmployee(getEmptyEmployeeToAdd());
        }
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

    const onAddEmployee = async (teamId) => {
      const response = await addEmployee(employee, teamId);
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
        return response;
      } else {
        return response;
      }
    };

    return (
      <Component
        {...props}
        employee={employee}
        team={parentTeam}
        onChangeEmployee={onChangeEmployee}
        onResetEmployee={onResetEmployee}
        onSaveEmployee={onSaveEmployee}
        onPromoteEmployee={onPromoteEmployee}
        onMoveEmployee={onMoveEmployee}
        onAddEmployee={onAddEmployee}
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
