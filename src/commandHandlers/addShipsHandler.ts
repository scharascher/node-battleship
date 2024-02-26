import { databaseInstance } from '../database';
import { WebSocket } from 'ws';
import { WSRequest } from '../types';
import { IGame } from '../database/GameDb';
import { wsServer } from '../wsServer';
import { wsSend, wsTurn } from './utils';
import { BOT_ID } from '../const';

export const addShipsHandler = (
  _: WebSocket,
  request: WSRequest<'add_ships'>,
) => {
  const game = databaseInstance.addShips(
    request.data.gameId,
    request.data.indexPlayer,
    request.data.ships,
  );
  const isGameReady = (game: IGame) => {
    return Object.values(game.players).every((p) => !!p.ships.length);
  };
  if (!game || !isGameReady(game)) return;
  let currentPlayerId: number | string;
  if (game.singlePlay) {
    currentPlayerId = game.userIds.find((id) => id !== BOT_ID)!;
  } else {
    const currentPlayerIndex = Math.random() > 0.5 ? 1 : 0;
    currentPlayerId = Object.keys(game.players)[currentPlayerIndex]!;
  }
  const userIds = game.userIds;
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

      if (currentPlayerId != null) {
        game.setCurrentTurnId(+currentPlayerId);
        wsTurn(client, +currentPlayerId);
      }
    }
  });
};
