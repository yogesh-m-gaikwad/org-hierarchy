import { Card, Space } from 'antd';
import React from 'react';

export const EmployeeDetailsPage = ({ employee }) => {
  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Card title="Employee Information" size="small">
        <p>ID: {employee._id}</p>
        <p>Name: {employee.name}</p>
        <p>Designation: {employee.role}</p>
        <p>Email: {employee.email}</p>
        <p>Phone: {employee.phone}</p>
      </Card>
    </Space>
  );
};

export default EmployeeDetailsPage;
