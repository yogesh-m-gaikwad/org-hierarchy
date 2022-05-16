import React, { useEffect } from 'react';

import { isEmpty } from '../utils/utils';
import { useHierarchy } from '../hooks/useHierarchy';

/**
 * This is HOC to load the hierarchy data using the getData function passed and pass that data
 * to the children on data property to use for further rendering.
 **/
const HierarchyLoader = ({ getData = async () => {}, children }) => {
  const [data, setData] = useHierarchy();
  const validData = !isEmpty(data);

  useEffect(() => {
    (async () => {
      const data = await getData();
      setData(data);
    })();
  }, [getData]);

  return validData ? (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { data });
        }
        return child;
      })}
    </>
  ) : (
    <div className={`row main hierarchy-entry`}>No match found.</div>
  );
};

export default HierarchyLoader;
