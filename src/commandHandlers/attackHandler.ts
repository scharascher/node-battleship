import { WebSocket } from 'ws';
import { WSRequest } from '../types';
import { databaseInstance } from '../database';
import {
  getRandomPosition,
  wsFinished,
  wsSend,
  wsTurn,
  wsUpdateWinners,
} from './utils';
import { wsServer } from '../wsServer';
import { BOT_ID } from '../const';

export const attackHandler = (ws: WebSocket, request: WSRequest<'attack'>) => {
  const { gameId, x, y, indexPlayer } = request.data;
  const game = databaseInstance.getGame(gameId);
  if (!game) return;
  if (game.finished) return wsFinished(game);

  const userIds = game.userIds;
  if (game.turnId !== indexPlayer) return;
  const position = { x, y };
  const status = databaseInstance.attack(gameId, indexPlayer, position);
  if (!status) return;
  if (game.finished) {
    if (!game.singlePlay) {
      databaseInstance.updateWinner(game.winnerId!);
      wsUpdateWinners();
    }
    return wsFinished(game);
  }
  let nextUserId =
    status === 'miss'
      ? userIds.find((id) => +id !== +indexPlayer)
      : indexPlayer;
  if (nextUserId != null) {
    game.setCurrentTurnId(+nextUserId);
  }
  wsServer.clients.forEach((client) => {
    const currentUser = databaseInstance.getUserByWs(ws);
    if (!userIds.includes(currentUser.id)) return;

    wsSend(client, {
      type: 'attack',
      id: 0,
      data: {
        position,
        currentPlayer: indexPlayer,
        status,
      },
    });
    wsTurn(client, game.turnId);
  });

  while (nextUserId === BOT_ID) {
    const victimId = indexPlayer;
    const field = game.players[victimId]!.field;
    const position = getRandomPosition(field);
    const status = databaseInstance.attack(gameId, BOT_ID, position);
    if (!status) return;
    if (game.finished) {
      databaseInstance.updateWinner(game.winnerId!);
      wsUpdateWinners();
      return wsFinished(game);
    }
    nextUserId = status === 'miss' ? indexPlayer : BOT_ID;
    if (nextUserId != null) {
      game.setCurrentTurnId(+nextUserId);
    }
    wsSend(ws, {
      type: 'attack',
      id: 0,
      data: {
        position,
        currentPlayer: BOT_ID,
        status,
      },
    });
    wsTurn(ws, game.turnId);
  }
};
