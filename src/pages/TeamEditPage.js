import React, { useEffect, useState } from 'react';

import { hasNoErrors } from '../utils/utils';
import { useHierarchy } from '../hooks/useHierarchy';

export const TeamEditPage = ({ team, onChangeTeam, onResetTeam, onSaveTeam, onRemoveTeam }) => {
  const [_hierarchy, _setHierarchy, reloadHierarchy] = useHierarchy();
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState(null);

  useEffect(() => {
    isValidData(team);
  }, [team]);

  const isValidData = (team) => {
    let errors = {};
    if (!team.name || team.name.length < 3 || team.name.length > 50) {
      errors.name = {
        message: 'Name is required and should be min 3 and max 50 characters long.',
      };
    }

    if (!team.email) {
      errors.email = {
        message: 'Email is required.',
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

  return (
    <div className="container">
      <div className="row">
        <h4 id="team-id" className="form-title">
          ID: {team._id}
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
      <div className="row">
        <div className="column column-offset-20">
          <button
            className="form-button"
            type="primary"
            onClick={(e) => {
              // Check for field validations return on failure
              if (!isValidData(team)) return;

              onSaveTeam(team).then(() => {
                reloadHierarchy();
              });
            }}
          >
            Save
          </button>
        </div>
        <div className="column">
          <button
            className="form-button"
            type="primary"
            onClick={(e) => {
              onResetTeam();
            }}
          >
            Reset
          </button>
        </div>
        <div className="column">
          <button
            className="form-button"
            type="danger"
            onClick={(e) => {
              onRemoveTeam(team).then((response) => {
                if (response && response.data === 'error') {
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
        {formMessage && <label className={`${formMessage.type}-message`}>{formMessage.text}</label>}
      </div>
    </div>
  );
};

export default TeamEditPage;
