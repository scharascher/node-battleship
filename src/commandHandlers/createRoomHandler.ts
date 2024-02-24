import { databaseInstance } from '../database';
import { wsUpdateRoom } from './utils';
import { WebSocket } from 'ws';

export const createRoomHandler = (ws: WebSocket) => {
  const user = databaseInstance.getUserByWs(ws);
  databaseInstance.createRoom(user);
  wsUpdateRoom();
};
