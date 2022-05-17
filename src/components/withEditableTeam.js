import React, { useEffect, useState } from 'react';
import {
  addTeam,
  deleteTeam,
  getEmployeeById,
  getTeamById,
  updateTeam,
} from '../services/dataService';

import PropTypes from 'prop-types';
import { getEmptyTeamToAdd } from '../utils/utils';
import { useNavigate } from 'react-router-dom';

/**
 * This is HOC to return Team edit and show component for a given team id along with
 * change, save, delete, reset methods to be used by the component passed to it.
 **/
const withEditableTeam = (Component, teamId, employeeId) => {
  return (props) => {
    const [originalTeam, setOriginalTeam] = useState(null);
    const [team, setTeam] = useState(null);
    const [parentEmployee, setParentEmployee] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
      (async () => {
        if (teamId) {
          const response = await getTeamById(teamId);
          setOriginalTeam(response.data);
          setTeam(response.data);
        }
        if (employeeId) {
          const response = await getEmployeeById(employeeId);
          setParentEmployee(response.data);
          setTeam(getEmptyTeamToAdd());
        }
      })();
    }, []);

    const onChangeTeam = async (changes) => {
      setTeam({ ...team, ...changes });
    };

    const onResetTeam = async () => {
      setTeam(originalTeam);
    };

    const onSaveTeam = async () => {
      const response = await updateTeam(team);
      setOriginalTeam(response.data);
      setTeam(response.data);

      return response;
    };

    const onAddTeam = async () => {
      const response = await addTeam(team);
      setOriginalTeam(response.data);
      setTeam(response.data);

      return response;
    };

    const onRemoveTeam = async () => {
      const response = await deleteTeam(team);

      if (response && response.status === 'success') {
        setOriginalTeam(null);
        setTeam(null);
        navigate(`/`);
      } else {
        return response;
      }
    };

    return (
      <Component
        {...props}
        team={team}
        employee={parentEmployee}
        onChangeTeam={onChangeTeam}
        onResetTeam={onResetTeam}
        onSaveTeam={onSaveTeam}
        onAddTeam={onAddTeam}
        onRemoveTeam={onRemoveTeam}
      />
    );
  };
};

withEditableTeam.propTypes = {
  Component: PropTypes.object,
  teamId: PropTypes.string,
};

export default withEditableTeam;
