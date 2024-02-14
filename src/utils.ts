import { WSRequest, WSResponse, WSResponseType } from './types';
import WebSocket from 'ws';
import { wsServer } from './wsServer';

export const getRequest = (data: WebSocket.RawData) => {
  const request: WSRequest<any> = JSON.parse(data.toString());
  return {
    ...request,
    data: request.data ? JSON.parse(request.data) : request.data,
  };
};

export const sendAll = <T extends WSResponseType>(message: WSResponse<T>) => {
  wsServer.clients.forEach(function (client) {
    client.send(stringifyResponse(message));
  });
};

export const stringifyResponse = (data: WSResponse<any>) => {
  return JSON.stringify({ ...data, data: JSON.stringify(data.data) });
};
