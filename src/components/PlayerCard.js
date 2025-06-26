import React from 'react';
import { canPick, getFlagImage, getRoleImage } from '../utils/playerCardUtils';
import { useAuction } from '../context/AuctionContext';


const PlayerCard = ({ player, onBuy, isCaptain }) => {
  const { favorites, toggleFavorite } = useAuction();
  const isFavorite = favorites.includes(player.id);
  const isObserver = localStorage.getItem('observer') === 'true';
  // console.log("==========================================")
  // console.log("Player Card Info:");
  // console.log("Player Name:", player.name);
  // console.log("Player Nationality:", player.nationality);
  // console.log("Player PlayWithAnotherLanguage:", player.playWithAnotherLanguage);
  // console.log("Captain playWithAnotherLanguage:", localStorage.getItem('playWithAnotherLanguage'));
  // console.log("Owner Username:", player.ownerUsername);
  // console.log("Both Chill", bothChill);
  // console.log("isObserver", isObserver);
  // console.log("isLocked", player.isLocked);
  // console.log("canPick", canPick(player.nationality, localStorage.getItem('nationality'), player.playWithAnotherLanguage, localStorage.getItem('playWithAnotherLanguage') === 'true'));
  // console.log("==========================================")
  const pickable =  isObserver || 
                    isCaptain ||
                    (player.ownerUsername !== localStorage.getItem('username') && 
                    player.isSubCaptain === false &&
                    canPick(player.nationality, localStorage.getItem('nationality'), player.playWithAnotherLanguage, localStorage.getItem('playWithAnotherLanguage') === 'true'));

  const availablePlayerCardClass = `available-player-card ${isFavorite ? 'favorite' : ''} ${pickable ? '' : player.isSubCaptain ? '' : 'unavailable'}`;
  const playerInfoClass = `player-info ${isCaptain ? 'captain' : ''}`;

  return (
    <div className={availablePlayerCardClass}>
      <div className={playerInfoClass}>
        <div className="player-name-battletag">
          <span className="player-name">{player.name}</span>
          <span className="player-battletag">{player.battleTag}</span>
        </div>
        <div className="player-details">
          <span className="player-nationality">
            {getFlagImage(player.nationality)}
          </span>
          <span className="player-role">
            {getRoleImage(player.primaryRole)}
          </span>
          {player.secondaryRole && (
            <span className="player-secondary-role">
              {getRoleImage(player.secondaryRole)}
            </span>
          )}
          {/* <span className="player-elo">
            {getEloImage(player.rank)}
          </span> */}
          {/* <div className="spoken-languages-container">
            Languages
            <div className="spoken-languages">
              {getSpokenLanguages(player.languages)}
            </div>
          </div> */}
        </div>
        {!isCaptain && (
          <>
            <span className="player-price">${player.price}</span>
            {player.isLocked !== true && (localStorage.getItem('observer') === 'false' && pickable) && (
              <button className="buy-button" onClick={() => onBuy(player)}>
                BUY
              </button>
            )}

          </>
        )}
        {!isCaptain && (
          <span
            className="favorite-star"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(player.id);
            }}
          >
            {isFavorite ? '★' : '☆'}
          </span>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
