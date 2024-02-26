import { WebSocket } from 'ws';
import { databaseInstance } from '../database';
import { sendCreateGame, wsUpdateRooms } from './utils';

export const singlePlayHandler = (ws: WebSocket) => {
  const user = databaseInstance.getUserByWs(ws);
  // databaseInstance.removeUserRooms(user.id);
  const room = databaseInstance.createRoom(user, { singlePlay: true });
  const game = databaseInstance.createGame(room);

  sendCreateGame(ws, game.id, user.id);
  wsUpdateRooms();
};
