import { faPenToSquare, faRectangleList } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import React from 'react';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { isObject } from '../utils/utils';

const HierarchyNodeRecursive = ({ data }) => {
  if (isObject(data)) {
    const nodeName = `${data.name} ${data.position ? '(' + data.position + ')' : ''}`;
    let editUrl = `/edit/employee/${data._id}`;
    let showUrl = `/employee/${data._id}`;

    if (data.type === 'team') {
      editUrl = `/edit/team/${data._id}`;
      showUrl = `/team/${data._id}`;
    }

    if (data.children && data.children.length > 0) {
      return (
        <>
          <div className={`row ${data.type} hierarchy-entry`}>
            <div className="">
              <FontAwesomeIcon icon={faCaretRight} style={{ paddingRight: 10, paddingBottom: 0 }} />
              <Link className="action-icon" to={{ pathname: showUrl, state: { employee: data } }}>
                {nodeName}
              </Link>
            </div>
            <div className="hierarchy-buttons">
              <Link className="action-icon" to={{ pathname: editUrl, state: { employee: data } }}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </Link>
              <Link className="action-icon" to={{ pathname: showUrl, state: { employee: data } }}>
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
        <div className={`row ${data.type} hierarchy-entry`}>
          <Link className="action-icon" to={{ pathname: editUrl, state: { employee: data } }}>
            <div className="">{nodeName}</div>
          </Link>
          <div className="hierarchy-buttons">
            <Link className="action-icon" to={{ pathname: editUrl, state: { employee: data } }}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </Link>
            <Link className="action-icon" to={{ pathname: showUrl, state: { employee: data } }}>
              <FontAwesomeIcon icon={faRectangleList} />
            </Link>
          </div>
        </div>
      );
    }
  }
};

export default HierarchyNodeRecursive;
