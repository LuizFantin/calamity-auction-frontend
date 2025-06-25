// src/components/AvailablePlayersList.js
import React, { useState } from 'react';
import PlayerCard from './PlayerCard';
import { canPick, getRoleImage } from '../utils/playerCardUtils';
import { useAuction } from '../context/AuctionContext';

const AvailablePlayersList = ({ players, onBuy }) => {
  const roles = ['TANK', 'DPS', 'HEALER', 'FLEX', 'SOLO'];
  const [selectedRoles, setSelectedRoles] = useState(roles);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const { favorites } = useAuction();

  const toggleRole = (role) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const toggleFavorites = () => {
    setShowOnlyFavorites(!showOnlyFavorites);
  };

  const toggleAvailability = () => {
    setShowOnlyAvailable(!showOnlyAvailable);
  }

  const filteredPlayers = players.filter(player => {
    const roleMatch = selectedRoles.length === 0 ||
      selectedRoles.includes(player.primaryRole) ||
      selectedRoles.includes(player.secondaryRole);
    const favoriteMatch = !showOnlyFavorites || favorites.includes(player.id);
    const isChill = localStorage.getItem('isChill') === 'true';
    const bothChill = isChill && player.isChill
    const isAvailable = !showOnlyAvailable | bothChill | canPick(player.nationality, localStorage.getItem('nationality'))
    return roleMatch && favoriteMatch && isAvailable;
  });

  const sortedPlayers = filteredPlayers.sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    // If favorite status is the same, sort alphabetically by name
    if (aFav === bFav) {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="relative">
      <div className="available-players-list">
        <h2>Available Players</h2>
        <div className="role-filters">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => toggleRole(role)}
              className={`role-filter ${selectedRoles.includes(role) ? 'active' : ''}`}
            >
              {getRoleImage(role)}
              <span className="role-name">{role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}</span>
            </button>
          ))}
          <button
            onClick={toggleFavorites}
            className={`role-filter favorite-filter ${showOnlyFavorites ? 'active' : ''}`}
          >
            <span className="favorite-star">★</span>
            <span className="role-name">Star</span>
          </button>
          <button
            onClick={toggleAvailability}
            className={`role-filter favorite-filter ${showOnlyAvailable ? 'active' : ''}`}
          >
            <span className="favorite-star">❌</span>
            <span className="role-name">Hide</span>
          </button>

        </div>
        {sortedPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} onBuy={onBuy} isCaptain={false} />
        ))}
      </div>
    </div>
  );
};

export default AvailablePlayersList;
