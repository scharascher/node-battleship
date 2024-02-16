import { regHandler } from './commandHandlers/regHandler';
import { getRequest } from './utils';
import { wsServer } from './wsServer';
import { createRoomHandler } from './commandHandlers/createRoomHandler';
import { addUserToRoomHandler } from './commandHandlers/addUserToRoomHandler';
import { addShipsHandler } from './commandHandlers/addShipsHandler';
import { attackHandler } from './commandHandlers/attackHandler';
import { randomAttackHandler } from './commandHandlers/randomAttackHandler';

wsServer.on('connection', (ws) => {
  console.log('New client connected!');
  ws.on('close', () => console.log('Client has disconnected!'));
  ws.on('message', (data) => {
    try {
      const request = getRequest(data);
      console.log(`Received: ${request.type} with data: `, request.data);
      switch (request.type) {
        case 'reg': {
          return regHandler(ws, request);
        }
        case 'create_room': {
          return createRoomHandler(ws);
        }
        case 'add_user_to_room': {
          return addUserToRoomHandler(ws, request);
        }
        case 'add_ships': {
          return addShipsHandler(ws, request);
        }
        case 'attack': {
          return attackHandler(ws, request);
        }
        case 'randomAttack': {
          return randomAttackHandler(ws, request);
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e, e.stack);
      } else {
        console.dir(e);
      }
    }
  });
  ws.onerror = function () {
    console.log('websocket error');
  };
});
