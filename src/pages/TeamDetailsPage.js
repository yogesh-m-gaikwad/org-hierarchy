import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getTeamById } from '../services/dataService';

/**
 * Team details page.
 * @returns TeamDetailsPage Component.
 */
const TeamDetailsPage = () => {
  const [team, setTeam] = useState(null);
  let params = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (params.teamId) {
        const response = await getTeamById(params.teamId);

        if (response.status === 'error') {
          setFormMessage({ text: response.message, type: 'error' });
        } else {
          setFormMessage('');
          setTeam(response.data);
        }
      }
    })();
  }, [params]);

  if (!team) {
    return <div>Loading...</div>;
  }

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
      <br></br>
      <div className="row">
        <button
          className="button button-small form-button"
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
          className="button button-small form-button"
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
