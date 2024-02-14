import { databaseInstance } from '../database';
import WebSocket from 'ws';
import { WSRequest } from '../types';
import { Game } from '../database/GameDb';
import { wsServer } from '../wsServer';
import { wsSend } from './utils';

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
  const isGameReady = (game: Game) => {
    return Object.values(game.players).every((p) => !!p.ships.length);
  };
  if (isGameReady(game)) {
    wsServer.clients.forEach((client) => {
      const user = databaseInstance.getUserByWs(client);
      wsSend(client, {
        type: 'start_game',
        id: 0,
        data: {
          ships: game.players[user.id]!.ships,
          currentPlayerIndex: user.id,
        },
      });
      // const currentPlayerIndex = Math.random() > 0.5 ? 1 : 0
      const currentPlayerId = Object.keys(game.players)[0];
      currentPlayerId &&
        wsSend(client, {
          type: 'turn',
          id: 0,
          data: {
            currentPlayer: +currentPlayerId,
          },
        });
    });
  }
};
