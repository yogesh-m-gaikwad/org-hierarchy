import 'antd/dist/antd.css';

import { Layout, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import EditTeamPage from '../pages/EditTeamPage';
import EmployeePageLoader from './EmployeePageLoader';
import FilterBar from './FilterBar';
import HierarchyContext from '../hooks/HierarchyContext';
import HierarchyLoader from './HierarchyLoader';
import HierarchyNodeRecursive from './HierarchyNodeRecursive';
import TeamDetailsPage from '../pages/TeamDetailsPage';
import TeamMebmersListPage from '../pages/TeamMembersListPage';
import { fetchDataFromLocalstorage } from '../services/dataService';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const App = () => {
  const [hierarchy, setHierarchy] = useState(null);

  return (
    <HierarchyContext.Provider value={{ hierarchy, setHierarchy }}>
      <Layout className="main-layout">
        <Header className="header">
          <Title level={3} style={{ color: '#ffffff', paddingTop: 15 }}>
            Hierarchy UI - Demo
          </Title>
        </Header>
        <Layout>
          <Sider
            width={400}
            className="site-layout-background"
            style={{
              padding: 10,
              overflowX: 'hidden',
              overflowY: 'hidden',
            }}
          >
            <FilterBar></FilterBar>
            <Space direction="verticle" align="top" className="hierarchy-container">
              <HierarchyLoader getData={fetchDataFromLocalstorage}>
                <HierarchyNodeRecursive />
              </HierarchyLoader>
            </Space>
          </Sider>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 24,
              minHeight: 280,
            }}
          >
            <Routes>
              <Route path="/employee/:employeeId" element={<EmployeePageLoader mode="show" />} />
              <Route path="/allteam/:employeeId" element={<TeamMebmersListPage />} />
              <Route path="/team/:teamId" element={<TeamDetailsPage />} />
              <Route
                path="/edit/employee/:employeeId"
                element={<EmployeePageLoader mode="edit" />}
              />
              <Route path="/edit/team/:teamId" element={<EditTeamPage />} />
            </Routes>
          </Content>
        </Layout>
        <Footer
          style={{
            textAlign: 'right',
            borderTop: '1px solid rgba(155, 165, 182, 0.3)',
          }}
        >
          Developed by: Yogesh M. Gaikwad
        </Footer>
      </Layout>
    </HierarchyContext.Provider>
  );
};

export default App;
