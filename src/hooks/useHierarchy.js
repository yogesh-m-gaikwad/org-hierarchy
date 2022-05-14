import { employeesData, teamsData } from '../services/dataService';

import HierarchyContext from './HierarchyContext';
import { generateHierarchy } from '../utils/utils';
import { useContext } from 'react';

/**
 * Custom Hierarchy hook to work on the shared hierarhcy context.
 * @returns The hierarcy state and its setState from contex.
 */
export const useHierarchy = () => {
  const { hierarchy, setHierarchy } = useContext(HierarchyContext);

  const reloadHierarchy = async () => {
    setHierarchy(generateHierarchy(employeesData, teamsData));
  };

  return [hierarchy, setHierarchy, reloadHierarchy];
};
