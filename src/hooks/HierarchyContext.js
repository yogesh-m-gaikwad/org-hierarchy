import { createContext } from 'react';

/**
 * This is shared context by the app to store the hierarchy state.
 */
export const HierarchyContext = createContext({
  hierarchy: {},
  setHierarchy: () => {},
});

export default HierarchyContext;
