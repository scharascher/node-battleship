import { Room, Ship } from '../types';

export type GamePlayer = { ships: Ship[] };
export type Game = { id: number; players: Record<number, GamePlayer> };
export class GameDb {
  private _games: Game[] = [];

  createGame(room: Room) {
    this._games.push({
      id: this._games.length,
      players: (room.roomUsers || []).reduce<Record<number, GamePlayer>>(
        (acc, user) => {
          acc[user.index] = { ships: [] };
          return acc;
        },
        {},
      ),
    });
    const game = this._games[this._games.length - 1]!;
    return game;
  }
  getGame(gameId: number) {
    return this._games[gameId];
  }
  addShips(gameId: number, userId: number, ships: Ship[]) {
    const user = this._games[gameId]?.players[userId];
    if (user) {
      user.ships = ships;
    }
    return this.getGame(gameId)!;
  }
}
