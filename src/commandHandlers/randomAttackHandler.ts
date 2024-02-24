import { WebSocket } from 'ws';
import { WSRequest } from '../types';
import { databaseInstance } from '../database';
import { getRandomPosition, getVictimId } from './utils';
import { attackHandler } from './attackHandler';

export const randomAttackHandler = (
  ws: WebSocket,
  request: WSRequest<'randomAttack'>,
) => {
  const game = databaseInstance.getGame(request.data.gameId);
  if (!game) return;
  const victimId = +getVictimId(game, request.data.indexPlayer)!;
  const field = game.players[victimId]!.field;
  const position = getRandomPosition(field);
  attackHandler(ws, {
    id: 0,
    type: 'attack',
    data: { ...request.data, x: position.x, y: position.y },
  });
};
