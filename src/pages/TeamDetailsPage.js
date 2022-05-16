import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Team details page.
 * @param {*} props
 * @returns TeamDetailsPage Component.
 */
const TeamDetailsPage = ({ team }) => {
  let navigate = useNavigate();

  return (
    <div className="container">
      <div className="row">
        <h4 className="form-title">Team Information</h4>
      </div>
      <div className="row">
        <div className="column column-20 title">ID:</div>
        <div className="column column-80">{team._id}</div>
      </div>
      <div className="row">
        <div className="column column-20 title">Name:</div>
        <div className="column column-80">{team.name}</div>
      </div>
      <div className="row">
        <div className="column column-20 title">Email:</div>
        <div className="column column-80">{team.email}</div>
      </div>
      <div className="row">
        <button
          className="form-button"
          type="button"
          title="Add Team Member"
          onClick={(e) => {
            // send blank employee in state to allow for add page load
            navigate(`/add/employee/${team._id}`, {
              state: { team, employee: { _id: '' } },
              replace: false,
            });
          }}
        >
          Add Team Member
        </button>
        <button
          className="form-button"
          type="button"
          title="Edit Team Details"
          onClick={(e) => {
            // send blank employee in state to allow for add page load
            navigate(`/edit/team/${team._id}`, {
              state: { team },
              replace: false,
            });
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default TeamDetailsPage;
