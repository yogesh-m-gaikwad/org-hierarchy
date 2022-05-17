import {
  EMPLOYEES_DATA_KEY,
  ORG_MAIN,
  TEAMS_DATA_KEY,
  TEAM_HEAD,
  TEAM_LEADER,
  TEAM_MEMBER,
} from '../utils/constants';
import { filter, generateEmployeeId, generateHierarchy, generateTeamId } from '../utils/utils';

import employees from '../data/employees.json';
import teams from '../data/teams.json';

/**
 * Using the data variables as globals only for demo app - to simulate the database transaction
 * In production/real application these will be fetched from database and all transactions will
 * update the database. In demo updating localStorage data after changes to these global variables.
 * Clearing employees-data and teams-data keys from local storage will reload data from json files.
 **/
export let employeesData = [];
export let teamsData = [];

/**
 * Fetch the data from local storage if available or load from json and use it to
 * generate a hierarchy used by the tree structure. This code can be moved to backend
 * in real projects to return the hierarchy computed to real data from database.
 * @returns The hierarchy generated after loading data from local storage or files.
 */
export const fetchDataFromLocalStorage = async () => {
  let localStorageEmployees = localStorage.getItem(EMPLOYEES_DATA_KEY);
  if (localStorageEmployees === null) {
    let transformedEmployees = employees.map((e) => {
      return { [e._id]: { ...e } };
    });
    transformedEmployees = Object.assign({}, ...transformedEmployees);
    localStorage.setItem(EMPLOYEES_DATA_KEY, JSON.stringify(transformedEmployees));
    employeesData = transformedEmployees;
  } else {
    employeesData = JSON.parse(localStorageEmployees);
  }

  let localStorageTeams = localStorage.getItem(TEAMS_DATA_KEY);
  if (localStorageTeams === null) {
    let transformedTeams = teams.map((t) => {
      return { [t._id]: { ...t } };
    });
    transformedTeams = Object.assign({}, ...transformedTeams);
    localStorage.setItem(TEAMS_DATA_KEY, JSON.stringify(transformedTeams));
    teamsData = transformedTeams;
  } else {
    teamsData = JSON.parse(localStorageTeams);
  }

  return generateHierarchy(employeesData, teamsData);
};

/**
 * Fetch employee using employee Id.
 * @param {*} employeeId
 * @returns The employee matching the provided id.
 */
export const getEmployeeById = async (employeeId) => {
  return employeesData.hasOwnProperty(employeeId) ? { data: employeesData[employeeId] } : {};
};

/**
 * Add new employee to DB (mocked using local storage for demo)
 * Real methods will call database services.
 */
export const addEmployee = async (employee, teamId) => {
  // Add employee in global variable and local storage storage to simulate db
  if (employee._id == '') {
    employee.parent_id = getTeamLeaderId(teamId);
    if (employee.parent_id == null) {
      employee.parent_id = teamId;
      employee.type = TEAM_LEADER;
    }
    employee._id = generateEmployeeId(employeesData);
    employeesData[employee._id] = { ...employee };
    localStorage.setItem(EMPLOYEES_DATA_KEY, JSON.stringify(employeesData));
  }

  return {
    data: employeesData[employee._id],
    message: 'Employee added successfully',
    status: 'success',
  };
};

/**
 * Update employee to DB (mocked using local storage for demo)
 * Real methods will call database services.
 */
export const updateEmployee = async (employee) => {
  // Update the employee data in global variable and local storage storage to simulate db
  if (employeesData.hasOwnProperty(employee._id)) {
    employeesData[employee._id] = { ...employee };
    localStorage.setItem(EMPLOYEES_DATA_KEY, JSON.stringify(employeesData));
  }

  return {
    data: employeesData[employee._id],
    message: 'Employee saved successfully',
    status: 'success',
  };
};

/**
 * Move employee new team (mocked using local storage for demo)
 * Real methods will call database services.
 */
export const moveEmployee = async (employee, newTeamId) => {
  let teamLeaderId = getTeamLeaderId(newTeamId);

  // Update the employee data in global variable and local storage storage to simulate db
  if (employeesData.hasOwnProperty(employee._id)) {
    employeesData[employee._id] = { ...employee, parent_id: teamLeaderId };
    localStorage.setItem(EMPLOYEES_DATA_KEY, JSON.stringify(employeesData));
  }

  return {
    data: employeesData[employee._id],
    message: 'Employee moved to new team successfully',
    status: 'success',
  };
};

/**
 * Promote a team leader (mocked using local storage for demo)
 * Real methods will call database services.
 */
export const promoteTeamLeader = async (employee, deleteFlag, employeesData) => {
  let responseTeam = await getTeamById(employee.parent_id);
  let oldTeam = responseTeam.data;
  let response = await getEmployeeById(oldTeam.manager_id);
  let oldHead = response.data;

  employeesData[employee._id] = {
    ...employee,
    parent_id: oldHead.parent_id,
    type: oldHead.type,
    position: oldHead.position,
    teams: oldHead.teams,
    order: oldHead.order,
  };

  let oldMembers = filter(employeesData, (e) => e.parent_id === employee._id);
  let keys = Object.keys(oldMembers);
  if (keys.length > 0) {
    let newRandomTeamMember = employeesData[keys[0]];
    employeesData[keys[0]] = {
      ...newRandomTeamMember,
      parent_id: employee.parent_id,
      type: employee.type,
      position: employee.position,
      teams: employee.teams,
    };

    keys.shift();
    keys.forEach((key) => {
      employeesData[key] = { ...employeesData[key], parent_id: newRandomTeamMember._id };
    });

    let oldTeams = filter(teamsData, (e) => e.manager_id === oldHead._id);
    Object.keys(oldTeams).forEach((key) => {
      teamsData[key] = { ...teamsData[key], manager_id: employee._id };
    });

    if (deleteFlag) {
      delete employeesData[oldHead._id];
    }
  }
};

/**
 * Promote an employee to next level.
 * @param {*} employee
 * @returns Promoted employee or error.
 */
export const promoteEmployee = async (employee) => {
  // Update the employee data in global variable and local storage storage to simulate db
  if (employeesData.hasOwnProperty(employee._id)) {
    if (employee.type === TEAM_LEADER) {
      await promoteTeamLeader(employee, true, employeesData);
    } else if (employee.type === TEAM_MEMBER) {
      let response = await getEmployeeById(employee.parent_id);
      let oldParent = response.data;

      employeesData[employee._id] = {
        ...employee,
        parent_id: oldParent.parent_id,
        type: oldParent.type,
        position: oldParent.position,
        teams: oldParent.teams,
      };

      let oldMembers = filter(employeesData, (e) => e.parent_id === oldParent._id);
      Object.keys(oldMembers).forEach((key) => {
        employeesData[key] = { ...employeesData[key], parent_id: employee._id };
      });

      let oldTeams = filter(teamsData, (e) => e.manager_id === oldParent._id);
      Object.keys(oldTeams).forEach((key) => {
        teamsData[key] = { ...teamsData[key], manager_id: employee._id };
      });

      delete employeesData[oldParent._id];
    } else if (employee.type === TEAM_HEAD) {
      let response = await getEmployeeById(employee.parent_id);
      let oldParent = response.data;

      let teamLeaderReplacement = getRandomTeamLeader(employee._id);

      if (teamLeaderReplacement) {
        let response = await getEmployeeById(teamLeaderReplacement);
        let randomTeamLeader = response.data;

        // promote random team leader without deleting manager
        await promoteTeamLeader(randomTeamLeader, false, employeesData);

        let oldMembers = filter(employeesData, (e) => e.parent_id === oldParent._id);
        Object.keys(oldMembers).forEach((key) => {
          employeesData[key] = { ...employeesData[key], parent_id: employee._id };
        });

        let oldTeams = filter(teamsData, (e) => e.manager_id === oldParent._id);
        Object.keys(oldTeams).forEach((key) => {
          teamsData[key] = { ...teamsData[key], manager_id: employee._id };
        });

        employeesData[employee._id] = {
          ...employee,
          parent_id: oldParent.parent_id,
          type: oldParent.type,
          position: oldParent.position,
          teams: [],
        };

        delete employeesData[employee._id].teams;
        delete employeesData[oldParent._id];
      } else {
        // delete all teams as there is no team leader found for this team head and promote
        for (const teamId of employeesData[managerId].teams) {
          delete teamsData[teamId];
        }

        let oldMembers = filter(employeesData, (e) => e.parent_id === oldParent._id);
        Object.keys(oldMembers).forEach((key) => {
          employeesData[key] = { ...employeesData[key], parent_id: employee._id };
        });

        let oldTeams = filter(teamsData, (e) => e.manager_id === oldParent._id);
        Object.keys(oldTeams).forEach((key) => {
          teamsData[key] = { ...teamsData[key], manager_id: employee._id };
        });

        delete employeesData[oldParent._id];
      }
    }

    localStorage.setItem(EMPLOYEES_DATA_KEY, JSON.stringify(employeesData));
    localStorage.setItem(TEAMS_DATA_KEY, JSON.stringify(teamsData));
  }

  return {
    data: employeesData[employee._id],
    message: 'Employee promoted successfully',
    status: 'success',
  };
};

/**
 * Delete employee from DB (mocked using local storage for demo)
 * Real methods will call database services.
 */
export const deleteEmployee = async (employee) => {
  // Update the employee data in global variable and local storage storage to simulate db
  if (employeesData.hasOwnProperty(employee._id)) {
    // only delete team member
    if (employeesData[employee._id].type == TEAM_MEMBER) {
      delete employeesData[employee._id];
      localStorage.setItem(EMPLOYEES_DATA_KEY, JSON.stringify(employeesData));
      return { status: 'success', message: 'Successfully deleted employee.' };
    }

    if (employeesData[employee._id].type == TEAM_LEADER) {
      // delete all the team members in hierarchy
      let teamMembers = filter(employeesData, (e) => e.parent_id === employee._id);
      Object.keys(teamMembers).forEach((key) => {
        delete employeesData[key];
      });

      delete employeesData[employee._id];
      localStorage.setItem(EMPLOYEES_DATA_KEY, JSON.stringify(employeesData));
      return { status: 'success', message: 'Successfully deleted team leader and members.' };
    } else if (employeesData[employee._id].type == TEAM_HEAD) {
      if (employeesData[employee._id].teams.length === 0) {
        delete employeesData[employee._id];
        localStorage.setItem(EMPLOYEES_DATA_KEY, JSON.stringify(employeesData));
        return { status: 'success', message: 'Successfully deleted employee.' };
      } else {
        return {
          status: 'error',
          message:
            'You can only delete team lead and members. Promote a existing team leader from child teams to remove department head.',
        };
      }
    } else {
      return {
        status: 'error',
        message:
          'You can only delete team lead and members. Promote a existing team leader from child teams to remove department head.',
      };
    }
  }

  return { data: employeesData[employee._id] };
};

export const getTeamById = async (teamId) => {
  return teamsData.hasOwnProperty(teamId) ? { data: teamsData[teamId] } : {};
};

/**
 * Fetch the team leader for a given team.
 * @param {*} teamId
 * @returns Team leader or null if not found.
 */
export const getTeamLeaderId = (teamId) => {
  let teamLeader = filter(employeesData, (e) => e.parent_id === teamId);
  let keys = Object.keys(teamLeader);
  if (keys && keys.length > 0) {
    return keys[0];
  }
  return null;
};

/**
 * Fetch a random team leader.
 * @param {*} managerId
 * @returns Random team leader id or null if none found.
 */
export const getRandomTeamLeader = (managerId) => {
  for (const teamId of employeesData[managerId].teams) {
    let teamLeaderId = getTeamLeaderId(teamId);
    if (teamLeaderId) return teamLeaderId;
  }

  return null;
};

/**
 * Add new team to DB (mocked using local storage for demo)
 * Real methods will call database services.
 */
export const addTeam = async (team) => {
  // Add team in global variable and local storage storage to simulate db
  if (team._id === '') {
    team._id = generateTeamId(teamsData);

    let response = await getEmployeeById(team.manager_id);
    let manager = response.data;

    teamsData[team._id] = { ...team, department: manager.department };
    localStorage.setItem(TEAMS_DATA_KEY, JSON.stringify(teamsData));

    // Update the teams entry for manager
    manager.teams.push(team._id);
    updateEmployee(manager);
  }

  return { data: teamsData[team._id], message: 'Team added successfully', status: 'success' };
};

/**
 * Update team to DB (mocked using local storage for demo)
 * Real methods will call database services.
 */
export const updateTeam = async (team) => {
  // Update the team data in global variable and local storage storage to simulate db
  if (teamsData.hasOwnProperty(team._id)) {
    teamsData[team._id] = { ...team };
    localStorage.setItem(TEAMS_DATA_KEY, JSON.stringify(teamsData));
  }

  return { data: teamsData[team._id], message: 'Team saved successfully', status: 'success' };
};

/**
 * Delete team from DB (mocked using local storage for demo)
 * Real methods will call database services.
 */
export const deleteTeam = async (team) => {
  // Update the team data in global variable and local storage storage to simulate db
  if (teamsData.hasOwnProperty(team._id)) {
    // only delete team member
    let hasTeamMembers = await hasTeamAnyMembers(team._id);
    if (!hasTeamMembers) {
      employeesData[team.manager_id].teams = employeesData[team.manager_id].teams.filter(
        (t) => t != team._id
      );

      delete teamsData[team._id];

      localStorage.setItem(TEAMS_DATA_KEY, JSON.stringify(teamsData));
      localStorage.setItem(EMPLOYEES_DATA_KEY, JSON.stringify(employeesData));
      return { status: 'success', message: 'Team deleted successfully' };
    } else {
      return { status: 'error', message: 'You can only delete teams without any members.' };
    }
  }

  return { status: 'error', message: 'Invalid Team Id' };
};

/**
 * Filter teams to which current employee can be assigned to.
 */
export const getAllowedTeams = async (employeeId) => {
  if (employeeId) {
    let parentTeamId = await getTeamId(employeeId);
    let parentDepartment = getDepartment(parentTeamId);
    let excludedTransitions = getExcludedTransitions(parentDepartment);
    let filteredTeams = filter(
      teamsData,
      (t) => t._id !== parentTeamId && !excludedTransitions.includes(t.department)
    );
    let filteredTeamsArray = Object.keys(filteredTeams).map((key) => {
      return { key: key, teamName: filteredTeams[key].name };
    });

    return filteredTeamsArray;
  }
  return [];
};

/**
 * Check if the given team has any members.
 * @param {*} teamId
 * @returns true if team has any members, false otherwise.
 */
export const hasTeamAnyMembers = async (teamId) => {
  if (teamId) {
    let filteredEmployees = filter(employeesData, (e) => e.parent_id === teamId);
    if (filteredEmployees && Object.keys(filteredEmployees).length > 0) {
      return true;
    }
  }

  return false;
};

/**
 * Get department for given team id.
 * @param {*} teamId
 * @returns department string.
 */
const getDepartment = (teamId) => {
  if (teamsData.hasOwnProperty(teamId)) {
    return teamsData[teamId].department;
  }

  return null;
};

/**
 * Returns excluded team for given department.
 * Used to check if the current team is excluded for move.
 * @param {*} department
 * @returns Array of departments excluded for movement.
 */
const getExcludedTransitions = (department) => {
  if (department === 'hr') {
    return ['design'];
  }

  return [];
};

/**
 * Get team for an employee.
 * @param {*} employeeId
 * @returns team id.
 */
export const getTeamId = async (employeeId) => {
  let response = await getEmployeeById(employeeId);
  let employee = response.data;
  if (employee) {
    if (employee.type === TEAM_MEMBER) {
      employee = await getEmployeeById(employee.parent_id);
      return employee.data.parent_id;
    }
    if (employee.type === TEAM_LEADER) {
      return employee.parent_id;
    }
  }

  return null;
};

/**
 * Get team members list.
 * @param {*} id
 * @returns List of team members reporting to given id.
 */
export const getTeamMembersData = (id) => {
  let employee = employeesData.hasOwnProperty(id) ? employeesData[id] : null;
  if (employee) {
    if (employee.type === ORG_MAIN) {
      let teamMembers = filter(employeesData, (e) => e.parent_id === id);
      let result = [];
      if (teamMembers && Object.keys(teamMembers).length > 0) {
        Object.keys(teamMembers).forEach((key) => {
          result.push(teamMembers[key]);
        });
        Object.keys(teamMembers).forEach((key) => {
          let data = getTeamMembersData(teamMembers[key]._id);
          if (data && data.length > 0) {
            result.push(...data);
          }
        });

        return result;
      }
    }
    if (employee.type === TEAM_HEAD) {
      let teams = filter(teamsData, (t) => t.manager_id === id);
      let result = [];
      if (teams && Object.keys(teams).length > 0) {
        Object.keys(teams).forEach((key) => {
          let data = getTeamMembersData(teams[key]._id);
          if (data && data.length > 0) {
            result.push(...data);
          }
        });

        return result;
      }
    }

    if (employee.type === TEAM_LEADER) {
      let result = [];
      result.push(employee);

      let teamMembers = filter(employeesData, (e) => e.parent_id === id);
      if (teamMembers && Object.keys(teamMembers).length > 0) {
        Object.keys(teamMembers).forEach((key) => {
          let data = getTeamMembersData(teamMembers[key]._id);
          if (data && data.length > 0) {
            result.push(...data);
          }
        });

        return result;
      }
    }
    if (employee.type === TEAM_MEMBER) {
      return [employee];
    }
  } else {
    let team = teamsData.hasOwnProperty(id) ? teamsData[id] : null;
    if (team._id) {
      let result = [];
      let teamMembers = filter(employeesData, (e) => e.parent_id === team._id);

      if (teamMembers && Object.keys(teamMembers).length > 0) {
        Object.keys(teamMembers).forEach((key) => {
          let data = getTeamMembersData(teamMembers[key]._id);
          if (data && data.length > 0) {
            result.push(...data);
          }
        });
      }

      return result;
    }
  }
};
