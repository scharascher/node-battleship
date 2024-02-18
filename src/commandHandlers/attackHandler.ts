import WebSocket from 'ws';
import { WSRequest } from '../types';
import { databaseInstance } from '../database';
import { wsFinished, wsSend, wsTurn, wsUpdateWinners } from './utils';
import { wsServer } from '../wsServer';

export const attackHandler = (ws: WebSocket, request: WSRequest<'attack'>) => {
  const game = databaseInstance.getGame(request.data.gameId);
  if (!game) return;
  if (game.finished) return wsFinished(game);
  const userIds = Object.keys(game.players).map((k) => +k);

  const position = { x: request.data.x, y: request.data.y };
  if (game.turnId !== request.data.indexPlayer) return;
  const status = databaseInstance.attack(
    request.data.gameId,
    request.data.indexPlayer,
    position,
  );
  if (!status) return;
  if (game.finished) {
    databaseInstance.updateWinner(game.winnerId!);
    wsUpdateWinners();
    return wsFinished(game);
  }
  const nextUserId =
    status === 'miss'
      ? userIds.find((id) => +id !== +request.data.indexPlayer)
      : request.data.indexPlayer;

  wsServer.clients.forEach((client) => {
    const user = databaseInstance.getUserByWs(ws);
    if (!userIds.includes(user.id)) return;

    wsSend(client, {
      type: 'attack',
      id: 0,
      data: {
        position,
        currentPlayer: user.id,
        status,
      },
    });
    if (nextUserId != null) {
      game.setCurrentTurnId(+nextUserId);
      wsTurn(client, +nextUserId);
    }
  });
};
