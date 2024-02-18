import { User } from '../types';

export class UserDb {
  users: User[] = [];

  addUser(name: string, password: string) {
    this.users.push({
      name,
      password,
      id: this.users.length,
      wins: 0,
    });
    return this.users[this.users.length - 1]!;
  }
}
