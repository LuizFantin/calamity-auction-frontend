import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post('auth/login', { username, password });
  return response.data;
};

export const fetchPlayers = async () => {
  const response = await api.get(`/players/1`);
  return response.data;
};

export const fetchCaptains = async () => {
  const response = await api.get(`/players/1/captains`);
  return response.data;
};

export const fetchTransaction = async () => {
  const response = await api.get(`/players/1/transactions`);
  return response.data;
}

export const buyPlayer = async (playerId, playerPrice, ownerUsername) => {
  const response = await api.post(`/players/1/buy/${playerId}`, {
    price: playerPrice,
    ownerUsername: ownerUsername
  });
  return response.data;
};


export default api;
