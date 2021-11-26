import { Enumerations } from './enumerations';

export namespace Users {
  export class ResponseUserRegister {
    message: string;
    user: User;
  }

  export class ResponseLoginUser {
    message: string;
    accessToken: string;
    refreshToken: string;

    public constructor(init?: Partial<ResponseLoginUser>) {
      Object.assign(this, init);
    }
  }

  export class User {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: Enumerations.Role;
    active: boolean;
    avatar: string;
    notificationToken:string;
    favourites: string[];

    public constructor(init?: Partial<User>) {
      Object.assign(this, init);
    }
  }
}
