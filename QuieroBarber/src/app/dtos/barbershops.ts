import { Barbers } from './barbers';
import { Comments } from './comments';
import { Services } from './services';
import { Users } from './users';

export namespace Barbershops {
  export class Barbershop {
    _id: string;
    name: string;
    description: string;
    phone: string;
    address: string;
    geo: {
      lat: number;
      lng: number;
    };
    images: [string];
    logo: string;
    social: {
      instagram: String;
      facebook: String;
      web: String;
      twitter: String;
      twitch: String;
    };
    barbers: [Barbers.Barber];
    comments: [Comments.Comment];
    created: Date;
    active: boolean;
    coffee: boolean;
    child: boolean;
    services: [Services.Service];
    owner: Users.User;
    schedule: {
      open: Date;
      close: Date;
    };
    public constructor(init?: Partial<Barbershop>) {
      Object.assign(this, init);
    }
  }

  export class BarbershopsResponse {
    message: string;
    barbershops: Barbershop[];
  }

  export class BarbershopResponse {
    message: string;
    barbershop: Barbershop;
  }
}
