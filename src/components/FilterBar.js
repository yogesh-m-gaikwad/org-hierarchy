import React, { useCallback, useMemo, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from '../utils/utils';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { useHierarchy } from '../hooks/useHierarchy';

/**
 * Search/Filter Bar container Component.
 * @returns The FilterBar Component.
 */
const FilterBar = () => {
  const [_hierarchy, _setHierarchy, reloadHierarchy, filterHierarchy] = useHierarchy();
  const [filterString, setFilterString] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce((filterString) => {
        if (filterString) {
          filterHierarchy(filterString);
        } else {
          reloadHierarchy();
        }
      }, 750),
    [filterString]
  );

  const handleChange = useCallback(
    (e) => {
      setFilterString(e.target.value);
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  return (
    <div direction="horizontal" align="center" className="row filter-bar">
      <div className="column-80">
        <input
          id="filter-hierarchy"
          className="filter"
          placeholder="Enter filter text..."
          value={filterString}
          onChange={handleChange}
        />
      </div>
      <div className="column-10 column-offset-10">
        <button
          id="refresh"
          title="Reload Hierarchy"
          type="button"
          onClick={() => {
            setFilterString('');
            reloadHierarchy();
          }}
          style={{ minWidth: 30, fontSize: 16 }}
        >
          <FontAwesomeIcon icon={faArrowsRotate} />
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
