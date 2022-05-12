import React from 'react';
import { isEmpty, isObject } from '../utils/utils';

const HierarchyNodeRecursive = ({ data }) => {
  if (isObject(data)) {
    const nodeName = `${data.name} ${data.role ? '(' + data.role + ')' : ''}`;

    if (!isEmpty(data.children)) {
      return (
        <>
          <div className={data.type}>
            {nodeName}
            {data.children.map((child, key) => {
              return <HierarchyNodeRecursive data={child} key={key}></HierarchyNodeRecursive>;
            })}
          </div>
        </>
      );
    } else {
      return <div className={data.type}>{nodeName}</div>;
    }
  }
};

export default HierarchyNodeRecursive;
