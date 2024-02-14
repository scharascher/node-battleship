import { WSResponse, WSResponseType } from '../types';
import WebSocket from 'ws';
import { databaseInstance } from '../database';
import { sendAll, stringifyResponse } from '../utils';

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
