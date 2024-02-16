export type WSRequest<T extends WSRequestType> = {
  type: T;
  data: WSRequestDataType[T];
  id: 0;
};

export type WSRequestType =
  | 'reg'
  | 'create_room'
  | 'add_user_to_room'
  | 'add_ships'
  | 'attack'
  | 'randomAttack';

export type WSRequestDataType = {
  reg: { name: string; password: string };
  create_room: string;
  add_user_to_room: {
    indexRoom: number;
  };
  add_ships: {
    gameId: number;
    ships: Ship[];
    indexPlayer: number /* id of the player in the current game */;
  };
  attack: {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number;
  };
  randomAttack: {
    gameId: number;
    indexPlayer: number /* id of the player in the current game */;
  };
};
export type WSResponse<T extends WSResponseType> = {
  type: T;
  data: WSResponseDataType[T];
  id: 0;
};
export type WSResponseType =
  | 'reg'
  | 'update_winners'
  | 'create_game'
  | 'update_room'
  | 'start_game'
  | 'attack'
  | 'turn'
  | 'finish';

export type WSResponseDataType = {
  reg: { name: string; index: number; error: boolean; errorText: string };
  update_winners: Array<{
    name: string;
    wins: number;
  }>;
  create_game: {
    idGame: number;
    idPlayer: number;
  };
  update_room: Room[];
  start_game: {
    ships: Ship[];
    currentPlayerIndex: number /* id of the player in the current game who have sent his ships */;
  };
  attack: {
    position: {
      x: number;
      y: number;
    };
    currentPlayer: number /* id of the player in the current game */;
    status: AttackStatus;
  };
  turn: {
    currentPlayer: number;
  };
  finish: {
    winPlayer: number;
  };
};
export type ShipType = 'small' | 'medium' | 'large' | 'huge';
export type AttackStatus = 'miss' | 'killed' | 'shot';
export type Ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipType;
};
export type User = { name: string; password: string; id: number; wins: 0 };
export type Winner = { name: string; wins: number };
export type RoomUser = {
  name: string;
  index: number;
};
export type Room = {
  roomId: number;
  roomUsers: RoomUser[];
};
export type Position = { x: number; y: number };
