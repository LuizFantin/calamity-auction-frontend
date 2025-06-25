// TeamList.js
import React from 'react';
import PlayerCard from './PlayerCard';

const TeamCard = ({ team, onBuy }) => {
  const username = localStorage.getItem('username');
  const isUserTeam = team.id === username;
  const teamClass = isUserTeam ? 'user-team' : '';

  // Sort players: locked players first, then unlocked players
  const sortedPlayers = [...team.players].sort((a, b) => {
    if (a.isLocked === b.isLocked) return 0;
    return a.isLocked ? -1 : 1;
  });

  return (
    <div className={`team-card ${teamClass}`}>
      <div className="team-header">
        <h3 className="team-name">{team.captain.name}'s Team</h3>
        <p className="team-gold">{team.coins} Coins</p>
      </div>
      <div className="team-captain">
        <PlayerCard player={team.captain} isCaptain={true} />
      </div>
      <div className="team-players">
        {sortedPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} isCaptain={false} onBuy={onBuy} />
        ))}
      </div>
    </div>
  );
};

const TeamList = ({ teams, onBuy }) => {
  return (
    <div className="team-list">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} onBuy={onBuy} />
      ))}
    </div>
  );
};

export default TeamList;
