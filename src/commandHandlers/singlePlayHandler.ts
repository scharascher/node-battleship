import { WebSocket } from 'ws';
import { databaseInstance } from '../database';
import { sendCreateGame } from './utils';

export const singlePlayHandler = (ws: WebSocket) => {
  const user = databaseInstance.getUserByWs(ws);
  const room = databaseInstance.createRoom(user, { singlePlay: true });
  const game = databaseInstance.createGame(room);
  sendCreateGame(ws, game.id, user.id);
};
