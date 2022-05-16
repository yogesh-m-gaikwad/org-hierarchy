import { ORG_MAIN, TEAM, TEAM_HEAD, TEAM_LEADER } from '../utils/constants';
import { faPenToSquare, faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { getTruncateLength, isObject } from '../utils/utils';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import React from 'react';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

/**
 * Loads the hierarchy recursively based on the json structure passed.
 * @param {*} object - team or employee row
 * @returns List of rows as per the hierarchy.
 */
const HierarchyNodeRecursive = ({ data }) => {
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

    if (data.children && data.children.length > 0) {
      return (
        <>
          <div className={`row ${data.type} hierarchy-entry`} title={nodeName}>
            <div className="">
              <FontAwesomeIcon icon={faCaretRight} style={{ paddingRight: 10, paddingBottom: 0 }} />
              <Link to={{ pathname: showUrl, state: { employee: data } }}>
                {truncate(nodeName, truncateAt)}
              </Link>
            </div>
            <div className="hierarchy-buttons">
              <Link
                className="action-icon"
                title="Edit"
                to={{ pathname: editUrl, state: { employee: data } }}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </Link>
              <Link
                className="action-icon"
                title="Show Details"
                to={{ pathname: showUrl, state: { employee: data } }}
              >
                <FontAwesomeIcon icon={faRectangleList} />
              </Link>
            </div>
          </div>
          {data.children &&
            data.children.map((child, key) => {
              return <HierarchyNodeRecursive data={child} key={key}></HierarchyNodeRecursive>;
            })}
        </>
      );
    } else {
      return (
        <div className={`row ${data.type} hierarchy-entry`} title={nodeName}>
          <Link to={{ pathname: editUrl, state: { employee: data } }}>
            <div className="">{truncate(nodeName, 28)}</div>
          </Link>
          <div className="hierarchy-buttons">
            <Link
              className="action-icon"
              title="Edit"
              to={{ pathname: editUrl, state: { employee: data } }}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Link>
            <Link
              className="action-icon"
              title="Show Details"
              to={{ pathname: showUrl, state: { employee: data } }}
            >
              <FontAwesomeIcon icon={faRectangleList} />
            </Link>
          </div>
        </div>
      );
    }
  }
};

export default HierarchyNodeRecursive;
