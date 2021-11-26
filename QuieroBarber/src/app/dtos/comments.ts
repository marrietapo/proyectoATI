import { Barbershops } from './barbershops';
import { Enumerations } from './enumerations';
import { Users } from './users';

export namespace Comments {

  export class Comment {
    _id: string;
    comment: string;
    rate: number;
    created: Date;
    user: Users.User;
    barbershop: Barbershops.Barbershop;

    public constructor(init?: Partial<Comment>) {
      Object.assign(this, init);
    }
  }

  export class CommentsResponse {
    message: string;
    comments: Comment[];
  }
}
