import { EMPLOYEES_DATA_KEY, TEAMS_DATA_KEY } from '../utils/constants';
import { faPenToSquare, faRectangleList } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

/**
 * Welcome Page for application.
 * @param {*} props
 * @returns WelcomePage Component.
 */
const WelcomePage = () => {
  return (
    <div className="container">
      <h2 className="form-title">Welcome to Hierarchy UI</h2>
      <div className="row">
        <ul>
          <li>Click employee/team title to view details page.</li>
          <li>
            Click edit
            <FontAwesomeIcon className="action-icon" icon={faPenToSquare} /> &nbsp;icon to open edit
            page.
          </li>
          <li>
            Click details
            <FontAwesomeIcon className="action-icon" icon={faRectangleList} /> &nbsp;icon to view
            details page.
          </li>
          <li>
            List of team members at a given level is available using 'Employees List' option on
            parent's page - for roles of head of department and ceo.
          </li>
          <li>
            To Promote, Delete and Move a team member access edit page for team member/employee.
            After promoting a team lead a random team member is selected as new lead if available.
          </li>
          <li>To add team member or new team visit the parent details page.</li>
          <li>
            The filter box will help to search team members using name, email or phone details. The
            hierarchy will be displayed filtered with matching members and their parents.
          </li>
          <li>
            Click refresh &nbsp;
            <FontAwesomeIcon icon={faArrowsRotate} /> &nbsp;button to refresh the hierarchy.
          </li>
          <li>
            To reset to original state click restore data link.
            <i style={{ padding: 0 }}>
              Note: this will revert all your changes cached in browser storage.
            </i>
            <input
              className="button button-clear"
              type="submit"
              value="Restore Data"
              onClick={() => {
                localStorage.removeItem(EMPLOYEES_DATA_KEY);
                localStorage.removeItem(TEAMS_DATA_KEY);
                window.location.reload(false);
              }}
            ></input>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WelcomePage;
