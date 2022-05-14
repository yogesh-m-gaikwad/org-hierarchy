import employees from '../data/employees.json';
import { generateHierarchy } from '../utils/utils';
import teams from '../data/teams.json';

/**
 * Using the data varibles as globals only for demo app - to simulate the database transaction
 * In production/real applicatoni these will be fetched from database and all transactions will
 * update the database. In demo updating localStorage data after changes to these global variables.
 * Clearing employees-data and teams-data keys from localstroage will reload data from json files.
 **/
export let employeesData = [];
export let teamsData = [];

/**
 * Fetch the data from localstorage if available or load from json and use it to
 * generate a hierarchy used by the tree structure. This code can be moved to backend
 * in real projects to return the hierarcy computed to real data from database.
 * @returns The hierarchy generated after loading data from localstorage or files.
 */
export const fetchDataFromLocalstorage = async () => {
  let localStorageEmployees = localStorage.getItem('employees-data');
  if (localStorageEmployees === null) {
    let tranformedEmployes = employees.map((e) => {
      return { [e._id]: { ...e } };
    });
    tranformedEmployes = Object.assign({}, ...tranformedEmployes);
    localStorage.setItem('employees-data', JSON.stringify(tranformedEmployes));
    employeesData = tranformedEmployes;
  } else {
    employeesData = JSON.parse(localStorageEmployees);
  }

  let localStorageTeams = localStorage.getItem('teams-data');
  if (localStorageTeams === null) {
    let tranformedTeams = teams.map((t) => {
      return { [t._id]: { ...t } };
    });
    tranformedTeams = Object.assign({}, ...tranformedTeams);
    localStorage.setItem('teams-data', JSON.stringify(tranformedTeams));
    teamsData = tranformedTeams;
  } else {
    teamsData = JSON.parse(localStorageTeams);
  }

  return generateHierarchy(employeesData, teamsData);
};

export const getEmployeeById = async (employeeId) => {
  return employeesData.hasOwnProperty(employeeId) ? { data: employeesData[employeeId] } : {};
};

export const updateEmployee = async (employee) => {
  // Update the employee data in global variable and localstorage storage to simulate db
  if (employeesData.hasOwnProperty(employee._id)) {
    employeesData[employee._id] = { ...employee };
    localStorage.setItem('employees-data', JSON.stringify(employeesData));
  }

  return { data: employeesData[employee._id] };
};

export const deleteEmployee = async (employee) => {
  // Update the employee data in global variable and localstorage storage to simulate db
  if (employeesData.hasOwnProperty(employee._id)) {
    // only delete team member
    if (employeesData[employee._id].type == 'member') {
      delete employeesData[employee._id];
      localStorage.setItem('employees-data', JSON.stringify(employeesData));
      return { data: 'success', message: 'Successully deleted employee.' };
    } else {
      return { data: 'error', message: 'You can only delete team members.' };
    }

    // TODO: add logic to delete other type of employees
  }

  return { data: employeesData[employee._id] };
};
