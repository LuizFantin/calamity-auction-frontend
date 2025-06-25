// AuctionRoom.js
import React, { useState, useEffect } from 'react';
import { fetchPlayers, buyPlayer, fetchCaptains } from '../utils/api';
import { connectSocket, disconnectSocket, onUpdate, } from '../utils/socket';
import AvailablePlayersList from './AvailablePlayersList';
import TeamList from './TeamList';
import TransactionHistory from './TransactionHistory';
import './auction.css';

const AuctionRoom = () => {
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const initAuction = async () => {
      try {
        await updateAuction();
        connectSocket();
        onUpdate(handlePlayerUpdate);
      } catch (error) {
        console.error('Failed to initialize auction:', error);
      }
    };

    initAuction();

    return () => {
      disconnectSocket();
    };
  }, []);

  const updateAuction = async () => {
    // Fetch all players
    const fetchedPlayers = await fetchPlayers();

    // Filter available players (no owner and not a captain)
    const availablePlayers = fetchedPlayers.filter(player =>
      player.ownerUsername === null && player.isCaptainUsername === null
    );
    setAvailablePlayers(availablePlayers);

    const fetchedCaptains = await fetchCaptains();

    // Filter captains
    const captains = fetchedPlayers.filter(player => player.isCaptainUsername !== null);

    // Create initial teams array
    const teamsArray = captains.map(captain => {
      const captainData = fetchedCaptains.find(c => c.username === captain.isCaptainUsername);
      return {
        id: captain.isCaptainUsername,
        captain: captain,
        coins: captainData?.coins || 0,
        players: []
      };
    });

    // Filter players with an owner
    const ownedPlayers = fetchedPlayers.filter(player => player.ownerUsername !== null);

    // Add owned players to their respective teams
    ownedPlayers.forEach(player => {
      const team = teamsArray.find(team => team.id === player.ownerUsername);
      if (team) {
        team.players.push(player);
      } else {
        console.warn(`Team for owner ${player.ownerUsername} not found. Skipping player ${player.id}`);
      }
    });

    // Update the teams state
    setTeams(teamsArray);
  };

  const updateTeams = async () => { }

  const handlePlayerUpdate = () => {
    console.log("A player has been bought");
    updateAuction();
    // Close the modal if it's open
    setShowModal(false);
    setIsConfirming(false);
    setSelectedPlayer(null);
  };

  const handleBuy = async (player) => {
    setSelectedPlayer(player);
    setShowModal(true);
  };

  const confirmPurchase = async () => {
    setIsConfirming(true);
    try {
      const buyer = localStorage.getItem('username');
      const team = teams.find(team => team.id.toLowerCase() === buyer.toLowerCase());
      if (!team) {
        console.error('Team not found for buyer:', buyer);
        return;
      }
      if (selectedPlayer.ownerUsername === buyer) {
        console.log('You already own this player.');
        return;
      }
      if (team.coins < selectedPlayer.price) {
        console.log('You do not have enough coins to buy this player.');
        return;
      }
      await buyPlayer(selectedPlayer.id, selectedPlayer.price, selectedPlayer.ownerUsername);
      // The actual update and modal closing will be handled by the socket event (handlePlayerUpdate)
    } catch (error) {
      console.error('Purchase failed:', error);
      setIsConfirming(false);
      // You might want to show an error message to the user here
    }
  };

  const cancelPurchase = () => {
    setShowModal(false);
    setSelectedPlayer(null);
    setIsConfirming(false);
  };

  const username = localStorage.getItem('username');
  const sortedTeams = teams.sort((teamA, teamB) => {
    if (teamA.captain.isCaptainUsername === username) {
      return -1;
    } else if (teamB.captain.isCaptainUsername === username) {
      return 1;
    }
  });

  return (
    <div className="auction-room">
      <TransactionHistory />
      <h1 className="auction-title">Calamity Divisão A</h1>
      <div className="auction-content">
        <AvailablePlayersList players={availablePlayers} onBuy={handleBuy} />
        <TeamList teams={teams} onBuy={handleBuy} />
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Confirm Purchase</h2>
            <p className="modal-message">
              Are you sure you want to buy {selectedPlayer.name} for {selectedPlayer.price} coins?
            </p>
            <div className="modal-buttons">
              <button
                className={`modal-button confirm-button ${isConfirming ? 'confirming' : ''}`}
                onClick={confirmPurchase}
                disabled={isConfirming}
              >
                {isConfirming ? 'Confirming...' : 'Confirm'}
              </button>
              <button className="modal-button cancel-button" onClick={cancelPurchase}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionRoom;
