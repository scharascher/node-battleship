import { databaseInstance } from '../database';
import { wsUpdateRooms } from './utils';
import { WebSocket } from 'ws';

export const createRoomHandler = (ws: WebSocket) => {
  const user = databaseInstance.getUserByWs(ws);
  databaseInstance.createRoom(user);
  wsUpdateRooms();
};
