import EmployeeAddPage from '../pages/EmployeeAddPage';
import EmployeeDetailsPage from '../pages/EmployeeDetailsPage';
import EmployeeEditPage from '../pages/EmployeeEditPage';
import React from 'react';
import { useParams } from 'react-router-dom';
import withEditableEmployee from './withEditableEmployee';

export const EmployeePageLoader = (props) => {
  let params = useParams();

  const EmployeeRootPage = withEditableEmployee(
    ({
      employee,
      team,
      onChangeEmployee,
      onResetEmployee,
      onSaveEmployee,
      onMoveEmployee,
      onPromoteEmployee,
      onAddEmployee,
      onRemoveEmployee,
      mode,
    }) => {
      if (employee) {
        if (mode === 'show') {
          return <EmployeeDetailsPage employee={employee} />;
        }
        if (mode === 'edit') {
          return (
            <EmployeeEditPage
              employee={employee}
              onChangeEmployee={onChangeEmployee}
              onResetEmployee={onResetEmployee}
              onSaveEmployee={onSaveEmployee}
              onMoveEmployee={onMoveEmployee}
              onPromoteEmployee={onPromoteEmployee}
              onRemoveEmployee={onRemoveEmployee}
            />
          );
        }
        if (mode == 'add') {
          return (
            <EmployeeAddPage
              team={team}
              employee={employee}
              onChangeEmployee={onChangeEmployee}
              onResetEmployee={onResetEmployee}
              onAddEmployee={onAddEmployee}
            />
          );
        }
      } else {
        return <div id="loading" />;
      }
    },
    params.employeeId,
    params.teamId
  );

  return <EmployeeRootPage {...props} />;
};

export default EmployeePageLoader;
