export const isObject = (o) => typeof o === 'object' && o !== null;
export const isEmpty = (obj) => {
  if (!obj) return true;
  else if (Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype)
    return true;
  else if (obj instanceof Array) return obj.length > 0;
  else return false;
};

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
    let sortedTeams = sort(filteredTeams, 'name');
    children = children.concat(
      sortedTeams.map((key) => {
        return {
          ...filteredTeams[key],
          parent_id: filteredTeams[key].manager_id,
          children: generateHierarchyForCurrent(filteredTeams[key], employees, teams),
        };
      })
    );
  }

  let filteredEmployees = filter(employees, (e) => e.parent_id === currentMember._id);
  let sortKey = 'name';
  if (currentMember.type === 'main') {
    sortKey = 'order';
  }
  let sortedEmployees = sort(filteredEmployees, sortKey);
  children = children.concat(
    sortedEmployees.map((key) => {
      return {
        ...filteredEmployees[key],
        children: generateHierarchyForCurrent(filteredEmployees[key], employees, teams),
      };
    })
  );

  return children;
};

export const filterHierarchyData = (employees, teams, filterString) => {
  let filteredEmployees = {};

  let filteredTeamMembers = filter(
    employees,
    (e) => e.type === 'member' && matchFilter(e, filterString)
  );

  let filteredTeamLeaders = filter(
    employees,
    (e) => e.type === 'teamleader' && matchFilter(e, filterString)
  );

  let filteredTeamHeads = filter(
    employees,
    (e) => e.type === 'head' && matchFilter(e, filterString)
  );

  let filteredTeams = filter(teams, (e) => matchFilter(e, filterString));

  filteredEmployees = {
    ...filteredEmployees,
    ...filteredTeamMembers,
    ...filteredTeamLeaders,
    ...filteredTeamHeads,
  };

  Object.keys(filteredTeamMembers).forEach((key) => {
    let member = filteredTeamMembers[key];
    let filteredParents = filter(employees, (e) => e._id === member.parent_id);

    filteredEmployees = { ...filteredEmployees, ...filteredParents };
  });

  Object.keys(filteredEmployees).forEach((key) => {
    let member = filteredEmployees[key];
    let filteredParentTeams = filter(teams, (t) => t._id === member.parent_id);

    filteredTeams = { ...filteredTeams, ...filteredParentTeams };
  });

  Object.keys(filteredTeams).forEach((key) => {
    let team = filteredTeams[key];
    let filteredParentHeads = filter(employees, (e) => e._id === team.manager_id);

    filteredEmployees = { ...filteredEmployees, ...filteredParentHeads };
  });

  let filteredKeys = Object.keys(filteredEmployees);
  if (filteredKeys.length > 0) {
    let ceo = filter(employees, (e) => e.type === 'main' && e.parent_id === null);
    filteredEmployees = { ...filteredEmployees, ...ceo };

    return generateHierarchy(filteredEmployees, filteredTeams);
  }

  return {};
};

export const generateHierarchyWithFilter = (currentMember, employees, teams, filterString) => {
  let children = [];

  if (currentMember && currentMember.teams && currentMember.teams.length > 0) {
    let filteredTeams = filter(teams, (t) => t.manager_id === currentMember._id);
    let sortedTeams = sort(filteredTeams, 'name');
    children = children.concat(
      sortedTeams.map((key) => {
        return {
          ...filteredTeams[key],
          parent_id: filteredTeams[key].manager_id,
          children: generateHierarchyWithFilter(filteredTeams[key], employees, teams, filterString),
        };
      })
    );
  }

  let filteredEmployees = filter(
    employees,
    (e) => e.parent_id === currentMember._id && matchFilter(e, filterString)
  );

  let sortKey = 'name';
  if (currentMember.type === 'main') {
    sortKey = 'order';
  }

  let sortedEmployees = sort(filteredEmployees, sortKey);
  children = children.concat(
    sortedEmployees.map((key) => {
      return {
        ...filteredEmployees[key],
        children: generateHierarchyWithFilter(
          filteredEmployees[key],
          employees,
          teams,
          filterString
        ),
      };
    })
  );

  return children;
};

function matchFilter(e, filterString) {
  if (e.name && e.name.toLowerCase().indexOf(filterString.toLowerCase()) >= 0) {
    return true;
  }

  if (e.phone && e.phone.indexOf(filterString) >= 0) {
    return true;
  }

  if (e.email && e.email.toLowerCase().indexOf(filterString.toLowerCase()) >= 0) {
    return true;
  }

  return false;
}

export const sort = (object, key) => {
  return Object.keys(object).sort((a, b) =>
    object[a][key] > object[b][key] ? 1 : object[b][key] > object[a][key] ? -1 : 0
  );
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

export const debounce = (func, delay) => {
  let debounceHandler;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceHandler);
    debounceHandler = setTimeout(() => func.apply(context, args), delay);
  };
};
