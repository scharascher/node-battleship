import WebSocket from 'ws';
import { WSRequest } from '../types';

export const singlePlayHandler = (
  ws: WebSocket,
  request: WSRequest<'single_play'>,
) => {
  console.log(ws, request);
};
