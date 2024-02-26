import { User, WSRequest } from '../types';
import { databaseInstance } from '../database';
import { wsSend, wsUpdateRoom, wsUpdateWinners } from './utils';
import { WebSocket } from 'ws';

export const regHandler = (ws: WebSocket, request: WSRequest<'reg'>) => {
  const {
    data: { name, password },
  } = request as WSRequest<'reg'>;

  let user: User | undefined;
  try {
    user = databaseInstance.getUser(ws, name, password);
  } catch (e) {
    wsSend(ws, {
      type: 'reg',
      id: 0,
      data: { name: '', index: -9, error: true, errorText: '' + e },
    });
    return;
  }
  if (!user) {
    user = databaseInstance.addUser(ws, name, password);
  }
  if (!user) return;
  wsSend(ws, {
    type: 'reg',
    id: 0,
    data: { name, index: user.id, error: false, errorText: '' },
  });
  wsUpdateRoom();
  wsUpdateWinners();
};
