import React from 'react';
import { useHierarchy } from '../hooks/useHierarchy';

const FilterBar = () => {
  const [_hierarchy, _setHierarchy, reloadHierarchy] = useHierarchy();
  return (
    <div direction="horizontal" align="center" className="row filter-bar">
      <div className="column-80">
        <input id="filter-hierarchy" className="filter" placeholder="Enter search string..." />
      </div>
      <div className="column-10 column-offset-10">
        <button
          id="refresh"
          type="primary"
          onClick={() => {
            reloadHierarchy();
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
