import { Position, WSResponse, WSResponseType } from '../types';
import { WebSocket } from 'ws';
import { databaseInstance } from '../database';
import { sendAll, stringifyResponse } from '../utils';
import { Field, FieldCell, IGame } from '../database/GameDb';
import { wsServer } from '../wsServer';

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
    data: databaseInstance.winners.map((w) => ({
      name: w.user.name,
      wins: w.wins,
    })),
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

export const getRandomPosition = (field: Field): Position => {
  let cell: FieldCell | undefined = undefined;
  let x = 0,
    y = 0;
  do {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);
    cell = field[x]![y]!;
  } while (cell && cell.checked);
  return { x, y };
};

export const wsFinished = (game: IGame) => {
  const userIds = Object.keys(game.players).map((k) => +k);
  wsServer.clients.forEach((client) => {
    const user = databaseInstance.getUserByWs(client);
    if (!userIds.includes(user.id)) return;
    if (game.finished) {
      {
        wsSend(client, {
          type: 'finish',
          id: 0,
          data: {
            winPlayer: game.winnerId!,
          },
        });
      }
    }
  });
};
