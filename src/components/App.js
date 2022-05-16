import { Link, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';

import EmployeePageLoader from './EmployeePageLoader';
import FilterBar from './FilterBar';
import HierarchyContext from '../hooks/HierarchyContext';
import HierarchyLoader from './HierarchyLoader';
import HierarchyNodeRecursive from './HierarchyNodeRecursive';
import TeamMembersListPage from '../pages/TeamMembersListPage';
import TeamPageLoader from './TeamPageLoader';
import WelcomePage from '../pages/WelcomePage';
import { fetchDataFromLocalStorage } from '../services/dataService';

const App = () => {
  const [hierarchy, setHierarchy] = useState(null);

  return (
    <HierarchyContext.Provider value={{ hierarchy, setHierarchy }}>
      <div className="container main-layout">
        <div className="row header">
          <div className="column">
            <Link to={`/`}>
              <h3>Hierarchy UI</h3>
            </Link>
          </div>
        </div>
        <div className="row content">
          <div className="column sidebar">
            <FilterBar></FilterBar>
            <div className="row hierarchy-container">
              <HierarchyLoader getData={fetchDataFromLocalStorage}>
                <HierarchyNodeRecursive />
              </HierarchyLoader>
            </div>
          </div>
          <div
            className="column page-content"
            style={{
              margin: 24,
            }}
          >
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/employee/:employeeId" element={<EmployeePageLoader mode="show" />} />
              <Route
                path="/edit/employee/:employeeId"
                element={<EmployeePageLoader mode="edit" />}
              />
              <Route path="/add/employee/:teamId" element={<EmployeePageLoader mode="add" />} />

              <Route path="/team/:teamId" element={<TeamPageLoader mode="show" />} />
              <Route path="/edit/team/:teamId" element={<TeamPageLoader mode="edit" />} />
              <Route path="/add/team/:managerId" element={<TeamPageLoader mode="add" />} />

              <Route path="/team/list/:id" element={<TeamMembersListPage />} />
            </Routes>
          </div>
        </div>
        <div
          className="footer-row"
          style={{
            textAlign: 'right',
            borderTop: '1px solid rgba(155, 165, 182, 0.3)',
          }}
        >
          <div className="footer">Developed by: Yogesh M. Gaikwad</div>
        </div>
      </div>
    </HierarchyContext.Provider>
  );
};

export default App;
