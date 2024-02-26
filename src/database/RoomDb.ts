import { User, Room } from '../types';
export class RoomDb {
  private _rooms: Array<Room & { deleted: boolean; singlePlay: boolean }> = [];
  constructor() {
    this._rooms = [];
  }
  get visibleRooms() {
    return this._rooms
      .filter((r) => r.roomUsers.length < 2 && !r.deleted)
      .map((r) => ({ roomUsers: r.roomUsers, roomId: r.roomId }));
  }
  addRoom(user: User, options?: { singlePlay: boolean }) {
    this._rooms.push({
      roomId: this._rooms.length,
      roomUsers: [],
      deleted: false,
      singlePlay: !!(options && options.singlePlay),
    });
    const room = this._rooms[this._rooms.length - 1]!;
    this.addUserToRoom(user, room.roomId);
    return room;
  }
  addUserToRoom(user: User, roomId: number) {
    const room = this._rooms[roomId]!;
    if (room.roomUsers.find((u) => u.index === user.id)) return null;
    this.removeUserRooms(user.id);
    room.roomUsers.push({ name: user.name, index: user.id });
    return room;
  }

  removeRoom(id: number) {
    this._rooms[id]!.deleted = true;
  }

  private removeUserRooms(userId: number) {
    this._rooms.forEach((r, index) => {
      if (r.roomUsers.find((roomUser) => roomUser.index === userId)) {
        this._rooms[index]!.deleted = true;
      }
    });
  }
}
