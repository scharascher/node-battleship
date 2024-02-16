import { databaseInstance } from '../database';
import WebSocket from 'ws';
import { WSRequest } from '../types';
import { IGame } from '../database/GameDb';
import { wsServer } from '../wsServer';
import { wsSend, wsTurn } from './utils';

export const addShipsHandler = (
  _: WebSocket,
  request: WSRequest<'add_ships'>,
) => {
  const game = databaseInstance.addShips(
    request.data.gameId,
    request.data.indexPlayer,
    request.data.ships,
  );
  // const currentUser = databaseInstance.getUserByWs(ws);
  const isGameReady = (game: IGame) => {
    return Object.values(game.players).every((p) => !!p.ships.length);
  };
  if (game && isGameReady(game)) {
    const currentPlayerIndex = Math.random() > 0.5 ? 1 : 0;
    const currentPlayerId = Object.keys(game.players)[currentPlayerIndex];
    const userIds = Object.keys(game.players).map((k) => +k);
    wsServer.clients.forEach((client) => {
      const user = databaseInstance.getUserByWs(client);
      if (userIds.includes(user.id)) {
        wsSend(client, {
          type: 'start_game',
          id: 0,
          data: {
            ships: game.players[user.id]!.ships,
            currentPlayerIndex: user.id,
          },
        });

        currentPlayerId != null && wsTurn(client, +currentPlayerId);
      }
    });
  }
};
