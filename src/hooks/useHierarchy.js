import { employeesData, teamsData } from '../services/dataService';
import { filterHierarchyData, generateHierarchy } from '../utils/utils';

import HierarchyContext from './HierarchyContext';
import { useContext } from 'react';

/**
 * Custom Hierarchy hook to work on the shared hierarchy context.
 * @returns The hierarchy state and its setState from context.
 */
export const useHierarchy = () => {
  const { hierarchy, setHierarchy } = useContext(HierarchyContext);

  const reloadHierarchy = async () => {
    setHierarchy(generateHierarchy(employeesData, teamsData));
  };

  const filterHierarchy = (filterString) => {
    setHierarchy(filterHierarchyData(employeesData, teamsData, filterString));
  };

  return [hierarchy, setHierarchy, reloadHierarchy, filterHierarchy];
};
