import React, { useState } from 'react';

import { hasNoErrors } from '../utils/utils';
import { useHierarchy } from '../hooks/useHierarchy';

export const TeamAddPage = ({ employee, team, onChangeTeam, onAddTeam }) => {
  const [_hierarchy, _setHierarchy, reloadHierarchy] = useHierarchy();
  const [errors, setErrors] = useState({});
  const [formMessage, _setFormMessage] = useState(null);

  const isValidData = (team) => {
    let errors = {};
    if (!team.name || team.name.length < 3 || team.name.length > 50) {
      errors.name = {
        message: 'Name is required to be min 3 & max 50 characters.',
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
        <h4 className="form-label form-title">Add New Team</h4>
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
        <div className="column column-20 column-offset-80">
          <button
            className="form-button"
            type="primary"
            onClick={(e) => {
              if (!isValidData(team)) return;

              team.manager_id = employee._id;
              onAddTeam(team).then((_response) => {
                reloadHierarchy();
              });
            }}
          >
            Add
          </button>
        </div>
      </div>
      <div className="row">
        {formMessage && <label className={`${formMessage.type}-message`}>{formMessage.text}</label>}
      </div>
    </div>
  );
};

export default TeamAddPage;
