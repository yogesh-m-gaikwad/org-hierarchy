export const isObject = (o) => typeof o === 'object' && o !== null;
export const isEmpty = (o) => o && o.length === 0;
export const hasNoErrors = (o) => o && typeof o === 'object' && Object.keys(o).length === 0;

Object.filter = function (obj, predicate) {
  let result = {},
    key;

  for (key in obj) {
    if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
      result[key] = obj[key];
    }
  }

  return result;
};

export const generateHierarchy = (employees, teams) => {
  let hierarchy = {};
  let ceo = filter(employees, (e) => e.type === 'main' && e.parent_id === null);
  let keys = Object.keys(ceo);
  if (keys && keys.length > 0) {
    hierarchy = {
      ...ceo[keys[0]],
      children: generateHierarchyForCurrent(ceo[keys[0]], employees, teams),
    };
  }

  return hierarchy;
};

export const generateHierarchyForCurrent = (currentMember, employees, teams) => {
  let children = [];

  if (currentMember && currentMember.teams && currentMember.teams.length > 0) {
    let filteredTeams = filter(teams, (t) => t.manager_id === currentMember._id);
    children = children.concat(
      Object.keys(filteredTeams).map((key) => {
        return {
          ...filteredTeams[key],
          parent_id: filteredTeams[key].manager_id,
          children: generateHierarchyForCurrent(filteredTeams[key], employees, teams),
        };
      })
    );
  }

  let filteredEmployees = filter(employees, (e) => e.parent_id === currentMember._id);
  children = children.concat(
    Object.keys(filteredEmployees).map((key) => {
      return {
        ...filteredEmployees[key],
        children: generateHierarchyForCurrent(filteredEmployees[key], employees, teams),
      };
    })
  );

  return children;
};

const filter = function (obj, predicate) {
  let result = {},
    key;

  for (key in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key])) {
      result[key] = obj[key];
    }
  }

  return result;
};
