import React, { useEffect } from 'react';

import { useHierarchy } from '../hooks/useHierarchy';

/**
 * This is HOC to load the hierarchy data using the getData fuction passed and pass that data
 * to the chidren on data property to use for further rendering.
 **/
const HierarchyLoader = ({ getData = async () => {}, children }) => {
  const [data, setData] = useHierarchy();

  useEffect(() => {
    (async () => {
      const data = await getData();
      setData(data);
    })();
  }, [getData]);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { data });
        }
        return child;
      })}
    </>
  );
};

export default HierarchyLoader;
