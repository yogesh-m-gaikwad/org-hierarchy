import React, { useEffect, useState } from 'react';
import {
  addTeam,
  deleteTeam,
  getEmployeeById,
  getTeamById,
  updateTeam,
} from '../services/dataService';
import { useNavigate, useParams } from 'react-router-dom';

import { EMAIL_VALIDATION_REGEX } from '../utils/constants';
import { hasNoErrors } from '../utils/utils';
import { useHierarchy } from '../hooks/useHierarchy';

/**
 * Edit Team details page.
 * @returns TeamEditPage Component.
 */
export const TeamEditPage = () => {
  const [_hierarchy, _setHierarchy, reloadHierarchy, _filterHierarchy, appMessage, setAppMessage] =
    useHierarchy();
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState(null);
  const [originalTeam, setOriginalTeam] = useState(null);
  const [team, setTeam] = useState(null);
  const [parentEmployee, setParentEmployee] = useState(null);
  let navigate = useNavigate();
  let params = useParams();

  useEffect(() => {
    (async () => {
      if (params.teamId) {
        let response = await getTeamById(params.teamId);
        setOriginalTeam(response.data);
        setTeam(response.data);
        if (response.data && response.data.manager_id) {
          response = await getEmployeeById(response.data.manager_id);
          setParentEmployee(response.data);
        }
      }
    })();
  }, [params]);

  useEffect(() => {
    if (team) {
      isValidData(team);
    }
  }, [team]);

  useEffect(() => {
    let timer;
    timer = setTimeout(() => {
      setFormMessage('');
    }, 2500);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [formMessage]);

  const onChangeTeam = async (changes) => {
    setTeam({ ...team, ...changes });
  };

  const onResetTeam = async () => {
    setTeam(originalTeam);
  };

  const onSaveTeam = async () => {
    const response = await updateTeam(team);

    if (response && response.status === 'error') {
      setFormMessage({ text: response.message, type: 'error' });
      setTeam(team);
    }

    if (response.status === 'success') {
      setFormMessage({ text: response.message, type: 'success' });
      setOriginalTeam(response.data);
      setTeam(response.data);
    }
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

  const isValidData = (team) => {
    let errors = {};
    if (!team.name || team.name.length < 3 || team.name.length > 50) {
      errors.name = {
        message: 'Name is required and should be min 3 and max 50 characters long.',
      };
    }

    if (!team.email || !team.email.match(EMAIL_VALIDATION_REGEX)) {
      errors.email = {
        message: 'A valid email is required.',
      };
    }

    if (hasNoErrors(errors)) {
      setErrors({});
      return true;
    } else {
      setErrors(errors);
      return false;
    }
  };

  if (!team) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <h4 id="team-id" className="form-title">
          Team ID: <span style={{ color: '#9b4dca' }}>{team._id}</span>
        </h4>
      </div>
      <div className="row">
        <div className="column column-20">
          <label className="form-label required">Name:</label>
        </div>
        <div className="column column-80">
          <input
            className="form-field"
            type="text"
            value={team.name}
            name="name"
            onChange={(e) => {
              onChangeTeam({ name: e.target.value });
            }}
          />
          {errors.name && <label className="error-message">{errors.name.message}</label>}
        </div>
      </div>
      <div className="row">
        <div className="column column-20">
          <label className="form-label required">Email:</label>
        </div>
        <div className="column column-80">
          <input
            className="form-field"
            type="text"
            value={team.email}
            name="email"
            onChange={(e) => {
              onChangeTeam({ email: e.target.value });
            }}
          />
          {errors.email && <label className="error-message">{errors.email.message}</label>}
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="column  column-25 column-offset-20">
          <button
            className="button button-small form-button"
            type="button"
            title="Save Team Details"
            onClick={(e) => {
              // Check for field validations return on failure
              if (!isValidData(team)) return;

              onSaveTeam(team).then((response) => {
                reloadHierarchy();
                if (response && response.status === 'success') {
                  setAppMessage({ text: response.message, type: 'success' });
                }
              });
            }}
          >
            Save
          </button>
        </div>
        <div className="column column-25">
          <button
            className="button button-small  button-outline form-button"
            type="button"
            title="Reset Team Details"
            onClick={(e) => {
              onResetTeam();
            }}
          >
            Reset
          </button>
        </div>
        <div className="column  column-25">
          <button
            className="button button-small form-button"
            type="button"
            title="Delete Team"
            onClick={(e) => {
              onRemoveTeam(team).then((response) => {
                if (response && response.status === 'error') {
                  setFormMessage({ text: response.message, type: 'error' });
                } else {
                  reloadHierarchy();
                }
              });
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="row">
        {formMessage && (
          <label className={`${formMessage.type}-message form-message`}>{formMessage.text}</label>
        )}
        {appMessage && (
          <label className={`${appMessage.type}-message form-message`}>{appMessage.text}</label>
        )}
      </div>
    </div>
  );
};

export default TeamEditPage;
