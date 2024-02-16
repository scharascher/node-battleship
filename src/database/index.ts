import { UserDb } from './UserDb';
import { AttackStatus, Position, Room, Ship, User, Winner } from '../types';
import { RoomDb } from './RoomDb';
import WebSocket from 'ws';
import { GameDb } from './GameDb';

export class Database {
  private userDb: UserDb = new UserDb();
  private _winners: Winner[];
  private roomDb: RoomDb = new RoomDb();
  private gameDb: GameDb = new GameDb();
  private _userByWs = new Map<WebSocket, User>();
  addUser(ws: WebSocket, name: string, password: string) {
    const user = this.userDb.addUser(name, password);
    this._userByWs.set(ws, user);
    this.updateWinners();
    return user;
  }
  getUserByWs(ws: WebSocket) {
    return this._userByWs.get(ws)!;
  }
  get winners() {
    return this._winners;
  }
  get visibleRooms() {
    return this.roomDb.visibleRooms;
  }
  createRoom(user: User) {
    return this.roomDb.addRoom(user);
  }
  addUserToRoom(user: User, roomId: number) {
    const room = this.roomDb.addUserToRoom(user, roomId);
    return room;
  }
  createGame(room: Room) {
    return this.gameDb.createGame(room);
  }
  getGame(gameId: number) {
    return this.gameDb.getGame(gameId);
  }
  addShips(gameId: number, userId: number, ships: Ship[]) {
    return this.gameDb.getGame(gameId)?.addShips(userId, ships);
  }
  attack(gameId: number, attackerId: number, position: Position): AttackStatus {
    const game = this.gameDb.getGame(gameId);
    if (!game) return 'miss';
    return game.attack(attackerId, position);
  }
  private updateWinners() {
    this._winners = this.userDb.users.map((u) => ({
      wins: u.wins,
      name: u.name,
    }));
  }
}

export const databaseInstance = new Database();
