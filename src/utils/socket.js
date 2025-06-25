import io from 'socket.io-client';
import config from '../config';

const socket = io(config.SOCKET_URL, {
  autoConnect: false,
});
export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const onUpdate = (callback) => {
  socket.on('update', callback);
};

export default socket;