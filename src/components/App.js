import React from 'react';
import hierarchy from '../data/hierarchy.json';
import HierarchyNodeRecursive from './HierarchyNodeRecursive';

const App = () => {
  return <HierarchyNodeRecursive data={hierarchy} />;
};

export default App;
