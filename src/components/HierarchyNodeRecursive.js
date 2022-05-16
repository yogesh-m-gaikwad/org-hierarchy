import { isEmpty, isObject } from '../utils/utils';

import { Link } from 'react-router-dom';
import React from 'react';

const HierarchyNodeRecursive = ({ data }) => {
  if (isObject(data)) {
    const nodeName = `${data.name} ${data.position ? '(' + data.position + ')' : ''}`;
    let editUrl = `/edit/employee/${data._id}`;
    let showUrl = `/employee/${data._id}`;

    if (data.type === 'team') {
      editUrl = `/edit/team/${data._id}`;
      showUrl = `/team/${data._id}`;
    }

    if (!isEmpty(data.children)) {
      return (
        <>
          <div className={`row ${data.type} hierarchy-entry`}>
            <div className="">{nodeName}</div>
            <div className="hierarchy-buttons">
              <Link className="action-icon" to={{ pathname: editUrl, state: { employee: data } }}>
                <input className="button button-clear button-inline" type="submit" value="Edit" />
              </Link>
              <Link className="action-icon" to={{ pathname: showUrl, state: { employee: data } }}>
                <input className="button button-clear button-inline" type="submit" value="Show" />
              </Link>
            </div>
          </div>
          {data.children.map((child, key) => {
            return <HierarchyNodeRecursive data={child} key={key}></HierarchyNodeRecursive>;
          })}
        </>
      );
    } else {
      return (
        <div className={`row ${data.type} hierarchy-entry`}>
          <div className="">{nodeName}</div>
          <div className="hierarchy-buttons">
            <Link className="action-icon" to={{ pathname: editUrl, state: { employee: data } }}>
              <input className="button button-clear button-inline" type="submit" value="Edit" />
            </Link>
            <Link className="action-icon" to={{ pathname: showUrl, state: { employee: data } }}>
              <input className="button button-clear button-inline" type="submit" value="Show" />
            </Link>
          </div>
        </div>
      );
    }
  }
};

export default HierarchyNodeRecursive;
