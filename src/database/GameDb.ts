import { AttackStatus, Position, Room, Ship } from '../types';
import { getVictimId } from '../commandHandlers/utils';

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
  id: number;
  players: Record<number, GamePlayer>;
}
class Game implements IGame {
  public players: Record<number, GamePlayer>;
  constructor(
    public id: number,
    players: Record<number, Ship[]>,
  ) {
    this.players = {};
    Object.entries(players).forEach(([id, ships]) => {
      this.players[+id] = {
        ships: ships.map((s) => ({ ...s, killed: false })),
        field: this.makeField(),
      };
    });
  }
  addShips(userId: number, ships: Ship[]) {
    const gamePlayer = this.players[userId];
    if (gamePlayer) {
      gamePlayer.ships = ships.map((s) => ({ ...s, killed: false }));
      this.placeShips(gamePlayer);
    }
    return this;
  }
  attack(attackerId: number, { x, y }: Position): AttackStatus {
    const victimId = getVictimId(this, attackerId);
    if (victimId == null) return 'miss';
    const victim = this.players[+victimId];
    if (!victim) return 'miss';
    if (!victim.field[x]?.[y]?.hasShip) return 'miss';
    const cell = victim.field[x]![y]!;
    const shipIndex = cell.shipIndex as number;
    cell.checked = true;
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
    return killed ? 'killed' : 'shot';
  }
  private makeField() {
    const field: Field = [];
    for (let i = 0; i < 10; i++) {
      field[i] = [];
      for (let j = 0; j < 10; j++) {
        field[i]![j] = { hasShip: false, checked: false, shipIndex: undefined };
      }
    }
    return field;
  }
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
