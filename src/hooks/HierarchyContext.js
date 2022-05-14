import { createContext } from 'react';

/**
 * This is shared conext by the app to store the hierarchy state.
 */
export const HierarchyContext = createContext({
  hierarchy: {},
  setHierarchy: () => {},
});

export default HierarchyContext;
