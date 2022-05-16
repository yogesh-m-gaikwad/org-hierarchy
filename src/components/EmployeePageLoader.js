import EmployeeAddPage from '../pages/EmployeeAddPage';
import EmployeeDetailsPage from '../pages/EmployeeDetailsPage';
import EmployeeEditPage from '../pages/EmployeeEditPage';
import React from 'react';
import { useParams } from 'react-router-dom';
import withEditableEmployee from './withEditableEmployee';

/**
 * Loads the HOC with correct parameter.
 * @param {*} props
 * @returns Returns a employee editable page component based on the parameter passed.
 */
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
        return (
          <div className="container">
            <div className="row">
              <h4 className="form-title">No record found.</h4>
            </div>
          </div>
        );
      }
    },
    params.employeeId,
    params.teamId
  );

  return <EmployeeRootPage {...props} />;
};

export default EmployeePageLoader;
