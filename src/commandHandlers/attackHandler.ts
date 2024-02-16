import WebSocket from 'ws';
import { WSRequest } from '../types';
import { databaseInstance } from '../database';
import { wsSend, wsTurn } from './utils';
import { wsServer } from '../wsServer';

export const attackHandler = (ws: WebSocket, request: WSRequest<'attack'>) => {
  const position = { x: request.data.x, y: request.data.y };
  const status = databaseInstance.attack(
    request.data.gameId,
    request.data.indexPlayer,
    position,
  );
  const game = databaseInstance.getGame(request.data.gameId);
  if (game) {
    const userIds = Object.keys(game.players).map((k) => +k);
    const nextUserId =
      status === 'miss'
        ? userIds.find((id) => +id !== +request.data.indexPlayer)
        : request.data.indexPlayer;
    wsServer.clients.forEach((client) => {
      const user = databaseInstance.getUserByWs(ws);
      if (userIds.includes(user.id)) {
        wsSend(client, {
          type: 'attack',
          id: 0,
          data: {
            position,
            currentPlayer: user.id,
            status,
          },
        });
        nextUserId != null && wsTurn(client, +nextUserId);
      }
    });
  }
};
