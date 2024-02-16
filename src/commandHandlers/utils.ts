import { Position, WSResponse, WSResponseType } from '../types';
import WebSocket from 'ws';
import { databaseInstance } from '../database';
import { sendAll, stringifyResponse } from '../utils';
import { FieldCell, IGame } from '../database/GameDb';

export const wsSend = <T extends WSResponseType>(
  ws: WebSocket,
  data: WSResponse<T>,
) => {
  console.log(`Send ${data.type} with data: `, data.data);
  ws.send(stringifyResponse(data));
};
export const wsUpdateRoom = () => {
  sendAll({
    type: 'update_room',
    id: 0,
    data: databaseInstance.visibleRooms,
  });
};

export const wsUpdateWinners = () => {
  sendAll<'update_winners'>({
    type: 'update_winners',
    id: 0,
    data: databaseInstance.winners,
  });
};

export const wsTurn = (client: WebSocket, id: number) => {
  wsSend(client, {
    type: 'turn',
    id: 0,
    data: {
      currentPlayer: id,
    },
  });
};

export const getVictimId = (game: IGame, attackerId: number) => {
  const id = Object.keys(game.players).find((p) => +p !== attackerId);
  if (id) return +id;
  return undefined;
};

export const getRandomPosition = (
  game: IGame,
  attackerId: number,
): Position => {
  const victimId = +getVictimId(game, attackerId)!;
  let cell: FieldCell | undefined = undefined;
  let x = 0,
    y = 0;
  while (cell?.checked) {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);
    cell = game.players[victimId]!.field[x]![y]!;
  }
  console.log('Random x,y: ', x, y);
  return { x, y };
};
