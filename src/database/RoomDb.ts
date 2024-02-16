import { User, Room } from '../types';
export class RoomDb {
  private _rooms: Room[] = [];
  get visibleRooms() {
    return this._rooms.filter((r) => r.roomUsers.length < 2);
  }
  addRoom(user: User) {
    this._rooms.push({
      roomId: this._rooms.length,
      roomUsers: [],
    });
    const room = this._rooms[this._rooms.length - 1]!;
    this.addUserToRoom(user, room.roomId);
  }
  addUserToRoom(user: User, id: number) {
    const room = this._rooms[id]!;
    room.roomUsers.push({ name: user.name, index: user.id });
    return room;
  }
}
