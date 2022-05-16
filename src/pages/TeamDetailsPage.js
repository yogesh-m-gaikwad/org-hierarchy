import React from 'react';
import { useNavigate } from 'react-router-dom';

const TeamDetailsPage = ({ team }) => {
  let navigate = useNavigate();

  return (
    <div className="container">
      <div className="row">
        <h4 className="form-title">Team Information</h4>
      </div>
      <div className="row">
        <p>ID: {team._id}</p>
      </div>
      <div className="row">
        <p>Name: {team.name}</p>
      </div>
      <div className="row">
        <p>Email: {team.email}</p>
      </div>
      <div className="row">
        <button
          className="form-button"
          type="primary"
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
      </div>
    </div>
  );
};

export default TeamDetailsPage;
