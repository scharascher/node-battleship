import { User } from '../types';

export class UserDb {
  users: User[] = [];
  addUser(name: string, password: string) {
    this.users.push({ name, password, id: this.users.length, wins: 0 });
    return this.users[this.users.length - 1]!;
  }
  removeUser(index: number) {
    this.users.splice(index, 1);
    return this;
  }
  getUser(index: number) {
    return this.users[index];
  }
}
