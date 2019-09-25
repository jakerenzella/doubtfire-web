import { User } from './user';

export class UserSerializer {
  fromJson(json: any): User {
    const user = new User();
    user.id = json.id;
    user.name = json.name;
    return user;
  }

  toJson(user: User): any {
    return {
      id: user.id,
      name: user.name
    };
  }
}
