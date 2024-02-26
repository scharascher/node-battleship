import { AttackStatus, Position, Room, Ship } from '../types';
import { getVictimId } from '../commandHandlers/utils';
import { makeField } from '../utils';
import { getRandomShips } from './ships';
import { BOT_ID } from '../const';

export type FieldCell = {
  hasShip: boolean;
  checked: boolean;
  shipIndex: number | undefined;
};
export type Field = Array<Array<FieldCell>>;
export type GamePlayer = {
  ships: Array<Ship & { killed: boolean }>;
  field: Field;
};
export interface IGame {
  turnId: number;
  id: number;
  finished: boolean;
  singlePlay: boolean;
  winnerId?: number;
  userIds: number[];
  players: Record<number, GamePlayer>;
}
export class Game implements IGame {
  public players: Record<number, GamePlayer>;
  public turnId: number;
  public finished = false;
  public winnerId?: number = undefined;

  get userIds() {
    return Object.keys(this.players).map((k) => +k);
  }
  constructor(
    public id: number,
    players: Record<number, Ship[]>,
    public singlePlay: boolean = false,
  ) {
    this.players = {};
    this.turnId = +Object.keys(players)[0]!;
    Object.entries(players).forEach(([id, ships]) => {
      this.players[+id] = {
        ships: Game.enrichShips(ships),
        field: makeField(),
      };
    });
    if (Object.entries(players).length === 1) this.singlePlay = true;
    if (this.singlePlay) {
      this.players[BOT_ID] = {
        ships: Game.enrichShips(getRandomShips()),
        field: makeField(),
      };
      this.placeShips(this.players[BOT_ID]);
    }
  }
  setCurrentTurnId(userId: number) {
    this.turnId = userId;
  }
  addShips(userId: number, ships: Ship[]) {
    const gamePlayer = this.players[userId];
    if (gamePlayer) {
      gamePlayer.ships = Game.enrichShips(ships);
      this.placeShips(gamePlayer);
    }
    return this;
  }
  attack(attackerId: number, { x, y }: Position): AttackStatus | null {
    const victimId = getVictimId(this, attackerId);
    if (victimId == null) return 'miss';
    const victim = this.players[+victimId];
    if (!victim) return 'miss';
    const cell = victim.field[x]?.[y];
    if (!cell || cell?.checked) return null;
    cell.checked = true;
    if (!cell.hasShip) return 'miss';
    const shipIndex = cell.shipIndex as number;
    const ship = victim.ships[shipIndex];
    if (!ship) return 'miss';
    let killed = true;
    if (ship.direction) {
      for (let i = ship.position.y; i < ship.position.y + ship.length; i++) {
        if (!victim.field[ship.position.x]![i]!.checked) {
          killed = false;
          break;
        }
      }
    } else {
      for (let i = ship.position.x; i < ship.position.x + ship.length; i++) {
        if (!victim.field[i]![ship.position.y]!.checked) {
          killed = false;
          break;
        }
      }
    }
    ship.killed = killed;
    if (victim.ships.every((s) => s.killed)) {
      this.finished = true;
      this.winnerId = attackerId;
    }
    return killed ? 'killed' : 'shot';
  }

  private static enrichShips = (
    ships: Ship[],
  ): Array<Ship & { killed: boolean }> => {
    return ships.map((s) => ({ ...s, killed: false }));
  };
  private placeShips(gamePlayer: GamePlayer) {
    gamePlayer.ships.forEach((ship, index) => {
      const { x, y } = ship.position;
      if (ship.direction) {
        for (let i = y; i < y + ship.length; i++) {
          gamePlayer.field[x]![i]!.hasShip = true;
          gamePlayer.field[x]![i]!.shipIndex = index;
        }
      } else {
        for (let i = x; i < x + ship.length; i++) {
          gamePlayer.field[i]![y]!.hasShip = true;
          gamePlayer.field[i]![y]!.shipIndex = index;
        }
      }
    });
  }
}
export class GameDb {
  private _games: Game[] = [];

  createGame(room: Room) {
    this._games.push(
      new Game(
        this._games.length,
        (room.roomUsers || []).reduce<Record<number, Ship[]>>((acc, user) => {
          acc[user.index] = [];
          return acc;
        }, {}),
      ),
    );

    const game = this._games[this._games.length - 1]!;
    return game;
  }
  getGame(gameId: number) {
    return this._games[gameId];
  }
}
