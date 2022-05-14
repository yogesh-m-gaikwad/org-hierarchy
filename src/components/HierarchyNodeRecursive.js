import React from 'react';
import { Link } from 'react-router-dom';
import { isEmpty, isObject } from '../utils/utils';
import { EditOutlined, IdcardOutlined } from '@ant-design/icons';

const HierarchyNodeRecursive = ({ data }) => {
  if (isObject(data)) {
    const nodeName = `${data.name} ${data.role ? '(' + data.role + ')' : ''}`;
    let editUrl = `/edit/employee/${data._id}`;
    let showUrl = `/employee/${data._id}`;

    if (data.type === 'team') {
      editUrl = `/edit/team/${data._id}`;
      showUrl = `/team/${data._id}`;
    }

    if (!isEmpty(data.children)) {
      return (
        <>
          <div className={data.type}>
            {nodeName}
            <Link className="action-icon" to={{ pathname: editUrl, state: { employee: data } }}>
              <EditOutlined />
            </Link>
            <Link className="action-icon" to={{ pathname: showUrl, state: { employee: data } }}>
              <IdcardOutlined />
            </Link>
            {data.children.map((child, key) => {
              return <HierarchyNodeRecursive data={child} key={key}></HierarchyNodeRecursive>;
            })}
          </div>
        </>
      );
    } else {
      return (
        <div className={data.type}>
          {nodeName}
          <Link className="action-icon" to={{ pathname: editUrl, state: { employee: data } }}>
            <EditOutlined />
          </Link>
          <Link className="action-icon" to={{ pathname: showUrl, state: { employee: data } }}>
            <IdcardOutlined />
          </Link>
        </div>
      );
    }
  }
};

export default HierarchyNodeRecursive;
