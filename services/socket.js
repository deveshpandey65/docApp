// /src/services/socket.js
import { io } from 'socket.io-client';

// Create socket connection
const URL = import.meta.env.VITE_API_URL;
export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true
});