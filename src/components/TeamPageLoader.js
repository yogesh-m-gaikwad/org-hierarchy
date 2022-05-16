import React from 'react';
import TeamAddPage from '../pages/TeamAddPage';
import TeamDetailsPage from '../pages/TeamDetailsPage';
import TeamEditPage from '../pages/TeamEditPage';
import { useParams } from 'react-router-dom';
import withEditableTeam from './withEditableTeam';

export const TeamPageLoader = (props) => {
  let params = useParams();

  const TeamRootPage = withEditableTeam(
    ({ team, employee, onChangeTeam, onResetTeam, onSaveTeam, onRemoveTeam, onAddTeam, mode }) => {
      if (team) {
        if (mode === 'show') {
          return <TeamDetailsPage team={team} />;
        }
        if (mode === 'edit') {
          return (
            <TeamEditPage
              team={team}
              onChangeTeam={onChangeTeam}
              onResetTeam={onResetTeam}
              onSaveTeam={onSaveTeam}
              onRemoveTeam={onRemoveTeam}
            />
          );
        }
        if (mode == 'add') {
          return (
            <TeamAddPage
              team={team}
              employee={employee}
              onChangeTeam={onChangeTeam}
              onResetTeam={onResetTeam}
              onAddTeam={onAddTeam}
            />
          );
        }
      } else {
        return <div id="loading" />;
      }
    },
    params.teamId,
    params.managerId
  );

  return <TeamRootPage {...props} />;
};

export default TeamPageLoader;
