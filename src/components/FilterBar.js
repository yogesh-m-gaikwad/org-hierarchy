import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import React from 'react';

const FilterBar = () => {
  return (
    <Space direction="horizontal" align="center" className="filter-bar">
      <Input
        placeholder="Enter search string..."
        suffix={<FilterOutlined />}
        style={{ minWidth: 332 }}
      />
      <Button type="primary" icon={<ReloadOutlined />} onClick={() => {}} />
    </Space>
  );
};

export default FilterBar;
