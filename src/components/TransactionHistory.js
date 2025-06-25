// src/components/TransactionHistory.js
import React, { useState, useEffect } from 'react';
import { fetchTransaction } from '../utils/api';
import { useAuction } from '../context/AuctionContext';
import { onUpdate } from '../utils/socket';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const { auctionId } = useAuction();

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const data = await fetchTransaction(auctionId);
        // Only keep the last 5 transactions
        setTransactions(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    getTransactions();
    onUpdate(getTransactions);
    return
  }, [auctionId]);

  return (
    <div className="transaction-history">
      <h2>Recent Transactions</h2>
      <div className="transaction-history-content">
        <div className="transaction-header">
          <span>Buyer</span>
          <span>Player</span>
          <span>Price</span>
          <span>Seller</span>
        </div>
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index} className="transaction-item">
              <span>{transaction.buyerUsername}</span>
              <span>{transaction.playerName}</span>
              <span>{transaction.price} coins</span>
              <span>{transaction.sellerUsername || 'Pool'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransactionHistory;
