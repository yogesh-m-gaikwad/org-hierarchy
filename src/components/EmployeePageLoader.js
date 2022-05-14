import EmployeeDetailsPage from '../pages/EmployeeDetailsPage';
import EmployeeEditPage from '../pages/EmployeeEditPage';
import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import withEditableEmployee from './withEditableEmployee';

export const EmployeePageLoader = (props) => {
  let params = useParams();

  const EmployeeRootPage = withEditableEmployee(
    ({ employee, onChangeEmployee, onResetEmployee, onSaveEmployee, onRemoveEmployee, mode }) => {
      const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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
              onRemoveEmployee={onRemoveEmployee}
            />
          );
        }
      } else {
        return <Spin indicator={antIcon} />;
      }
    },
    params.employeeId
  );

  return <EmployeeRootPage {...props} />;
};

export default EmployeePageLoader;
