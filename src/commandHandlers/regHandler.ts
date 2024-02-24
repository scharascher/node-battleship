import { WSRequest } from '../types';
import { databaseInstance } from '../database';
import { wsSend, wsUpdateRoom, wsUpdateWinners } from './utils';
import { WebSocket } from 'ws';

export const regHandler = (ws: WebSocket, request: WSRequest<'reg'>) => {
  const {
    data: { name, password },
  } = request as WSRequest<'reg'>;
  const user = databaseInstance.addUser(ws, name, password);
  wsSend(ws, {
    type: 'reg',
    id: 0,
    data: { name, index: user.id, error: false, errorText: '' },
  });
  wsUpdateRoom();
  wsUpdateWinners();
};
