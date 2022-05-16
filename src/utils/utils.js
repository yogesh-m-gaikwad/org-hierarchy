export const isObject = (o) => typeof o === 'object' && o !== null;
export const isEmpty = (o) => o && o.length === 0;
export const hasNoErrors = (o) => o && typeof o === 'object' && Object.keys(o).length === 0;

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

export const filter = function (obj, predicate) {
  let result = {},
    key;

  for (key in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key])) {
      result[key] = obj[key];
    }
  }

  return result;
};

export const getEmptyEmployeeToAdd = () => {
  return {
    _id: '',
    name: '',
    position: 'Team Member',
    email: '',
    phone: '',
    type: 'member',
    parent_id: '',
  };
};

export const getEmptyTeamToAdd = () => {
  return {
    _id: '',
    name: '',
    email: '',
    department: '',
    type: 'team',
    manager_id: '',
  };
};

export const generateEmployeeId = (employeesData) => {
  let ids = Object.keys(employeesData).map((a) => {
    return Number(a);
  });
  return String(Math.max(...ids) + 1);
};

export const generateTeamId = (teamsData) => {
  let ids = Object.keys(teamsData).map((a) => {
    return Number(a.substring(1));
  });
  return 'T' + (Math.max(...ids) + 1);
};
