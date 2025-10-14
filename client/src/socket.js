import { io } from 'socket.io-client';

export function createSocket() {
  const base = import.meta.env.VITE_API_BASE_ORIGIN || 'http://localhost:5000';
  return io(base, { transports: ['websocket'] });
}


