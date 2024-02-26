import { WSRequest, WSResponse, WSResponseType } from './types';
import { RawData } from 'ws';
import { wsServer } from './wsServer';
import { Field } from './database/GameDb';

export const getRequest = (data: RawData) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request: WSRequest<any> = JSON.parse(data.toString());
  return {
    ...request,
    data: request.data ? JSON.parse(request.data) : request.data,
  };
};

export const makeField = () => {
  const field: Field = [];
  for (let i = 0; i < 10; i++) {
    field[i] = [];
    for (let j = 0; j < 10; j++) {
      field[i]![j] = { hasShip: false, checked: false, shipIndex: undefined };
    }
  }
  return field;
};
export const sendAll = <T extends WSResponseType>(message: WSResponse<T>) => {
  wsServer.clients.forEach(function (client) {
    client.send(stringifyResponse(message));
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stringifyResponse = (data: WSResponse<any>) => {
  return JSON.stringify({ ...data, data: JSON.stringify(data.data) });
};
