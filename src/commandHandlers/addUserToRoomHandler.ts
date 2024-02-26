import { databaseInstance } from '../database';
import { WebSocket } from 'ws';
import { WSRequest } from '../types';
import { sendCreateGame, wsUpdateRoom } from './utils';
import { wsServer } from '../wsServer';

export const addUserToRoomHandler = (
  ws: WebSocket,
  request: WSRequest<'add_user_to_room'>,
) => {
  const currentUser = databaseInstance.getUserByWs(ws);
  const room = databaseInstance.addUserToRoom(
    currentUser,
    request.data.indexRoom,
  );
  if (!room) return;
  const game = databaseInstance.createGame(room);
  wsUpdateRoom();
  wsServer.clients.forEach((client) => {
    const userIds = game.userIds;
    const user = databaseInstance.getUserByWs(client);
    if (userIds.includes(user.id)) {
      sendCreateGame(client, game.id, user.id);
    }
  });
};
