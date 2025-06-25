import React, { createContext, useState, useContext, useEffect } from 'react';

const AuctionContext = createContext();

export const AuctionProvider = ({ children }) => {
  const [auctionId, setAuctionId] = useState('1');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (playerId) => {
    const newFavorites = favorites.includes(playerId)
      ? favorites.filter(id => id !== playerId)
      : [...favorites, playerId];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <AuctionContext.Provider value={{
      auctionId,
      setAuctionId,
      favorites,
      toggleFavorite
    }}>
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => useContext(AuctionContext);
