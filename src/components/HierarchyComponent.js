import { NavLink, useNavigate } from 'react-router-dom';
import { TEAM, TEAM_MEMBER } from '../utils/constants';
import { faPenToSquare, faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { getTruncateLength, isObject } from '../utils/utils';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

/**
 * Loads the hierarchy recursively based on the json structure passed.
 * @param {*} data - team or employee row data
 * @returns List of rows as per the hierarchy.
 */
const HierarchyComponent = ({ data }) => {
  let navigate = useNavigate();

  const truncate = (str, n) => {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  if (isObject(data)) {
    const nodeName = `${data.name} ${data.position ? '(' + data.position + ')' : ''}`;
    let editUrl = `/edit/employee/${data._id}`;
    let showUrl = `/employee/${data._id}`;

    let truncateAt = getTruncateLength(data.type);

    if (data.type === TEAM) {
      editUrl = `/edit/team/${data._id}`;
      showUrl = `/team/${data._id}`;
    }

    const navigateToEditPage = (e) => {
      e.preventDefault();
      navigate(editUrl);
    };

    const navigateToDetailsPage = (e) => {
      e.preventDefault();
      navigate(showUrl);
    };

    if (!data) {
      return <div className={`row main hierarchy-entry`}>No match found.</div>;
    }

    return (
      <>
        <NavLink
          className="hierarchy-row {({isActive}) => (isActive ? 'active' : '')}"
          to={{ pathname: showUrl, state: { employee: data } }}
        >
          <div className={`row ${data.type} hierarchy-entry`} title={nodeName}>
            <div className="">
              {data.type !== TEAM_MEMBER && (
                <FontAwesomeIcon
                  icon={faCaretRight}
                  style={{ paddingRight: 10, paddingBottom: 0 }}
                />
              )}

              {truncate(nodeName, truncateAt)}
            </div>
            <div className="hierarchy-buttons">
              <div
                className="icon-container action-icon"
                title="Edit"
                onClick={navigateToEditPage}
                to={{ pathname: editUrl, state: { employee: data } }}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </div>
              <div
                className="icon-container action-icon"
                title="Show Details"
                onClick={navigateToDetailsPage}
                to={{ pathname: showUrl, state: { employee: data } }}
              >
                <FontAwesomeIcon icon={faRectangleList} />
              </div>
            </div>
          </div>
        </NavLink>
        {data.children &&
          data.children.map((child, key) => {
            return <HierarchyComponent data={child} key={key}></HierarchyComponent>;
          })}
      </>
    );
  }
};

export default HierarchyComponent;
