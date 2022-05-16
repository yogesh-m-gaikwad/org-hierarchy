import React, { useState } from 'react';

import { EMAIL_VALIDATION_REGEX } from '../utils/constants';
import { hasNoErrors } from '../utils/utils';
import { useHierarchy } from '../hooks/useHierarchy';

/**
 * Add new team page.
 * @param {*} props
 * @returns TeamAddPage Component.
 */
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

  return (
    <div className="container">
      <div className="row">
        <h4 className="form-label form-title">Add New Team ({employee.position})</h4>
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
            autoFocus
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
        <div className="column column-20 column-offset-80">
          <button
            className="form-button"
            type="button"
            title="Add New Team"
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
