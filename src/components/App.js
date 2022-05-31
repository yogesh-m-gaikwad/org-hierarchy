import { Link, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import EmployeeAddPage from '../pages/EmployeeAddPage';
import EmployeeDetailsPage from '../pages/EmployeeDetailsPage';
import EmployeeEditPage from '../pages/EmployeeEditPage';
import ErrorPageNotFound from '../pages/ErrorPageNotFount';
import FilterBar from './FilterBar';
import HierarchyComponent from './HierarchyComponent';
import HierarchyContext from '../hooks/HierarchyContext';
import TeamAddPage from '../pages/TeamAddPage';
import TeamDetailsPage from '../pages/TeamDetailsPage';
import TeamEditPage from '../pages/TeamEditPage';
import TeamMembersListPage from '../pages/TeamMembersListPage';
import WelcomePage from '../pages/WelcomePage';
import { fetchDataFromLocalStorage } from '../services/dataService';

/**
 * Main Application container Component.
 * @returns The App Component.
 */
const App = () => {
  const [hierarchy, setHierarchy] = useState(null);
  const [appMessage, setAppMessage] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await fetchDataFromLocalStorage();
      setHierarchy(data);
    })();
  }, []);

  return (
    <HierarchyContext.Provider value={{ hierarchy, setHierarchy, appMessage, setAppMessage }}>
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
              <HierarchyComponent data={hierarchy} />
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
              <Route path="/employee/:employeeId" element={<EmployeeDetailsPage />} />
              <Route path="/edit/employee/:employeeId" element={<EmployeeEditPage />} />
              <Route path="/add/employee/:teamId" element={<EmployeeAddPage />} />
              <Route path="/team/:teamId" element={<TeamDetailsPage />} />
              <Route path="/edit/team/:teamId" element={<TeamEditPage />} />
              <Route path="/add/team/:managerId" element={<TeamAddPage />} />
              <Route path="/team/list/:id" element={<TeamMembersListPage />} />
              <Route path="*" element={<ErrorPageNotFound />} />
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
