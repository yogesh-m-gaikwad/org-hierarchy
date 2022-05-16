import { EMPLOYEES_DATA_KEY, TEAMS_DATA_KEY } from '../utils/constants';
import { faPenToSquare, faRectangleList } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

const WelcomePage = () => {
  return (
    <div className="container">
      <h2 className="form-title">Welcome to Hierarchy UI</h2>
      <div className="row">
        <ul>
          <li>Click employee/ team name to view details page.</li>
          <li>
            Click edit button <FontAwesomeIcon icon={faPenToSquare} /> open edit page.
          </li>
          <li>
            Click details button <FontAwesomeIcon icon={faRectangleList} /> to view details page.
          </li>
          <li>
            List of team members at a level can be viewed using 'Employees List' button on the
            parent's page - avilable for head and ceo.
          </li>
          <li>
            To Promote, Delete and Move a team member visit the edit page for that team
            member/employee.
          </li>
          <li>To add team member or new team visit the parent details page.</li>
          <li>
            The filter box will help you to list team membsers using name, email or phone details.
            THe hierarchy will be disaplyed filteed with maching members included at all levels.
          </li>
          <li>
            Click refresh <FontAwesomeIcon icon={faArrowsRotate} /> button to relead the hierarchy.
          </li>
          <li>
            To reset to original state click{' '}
            <input
              class="button button-clear"
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
