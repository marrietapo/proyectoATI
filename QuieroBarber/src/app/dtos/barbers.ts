import { Barbershops } from './barbershops';

export namespace Barbers {
  export class Barber {
    _id: string;
    name: string;
    lastName: string;
    description: string;
    aka: string;
    active: boolean;
    barbershop: Barbershops.Barbershop;
    avatar: string;
    from: Date;
    until: Date;

    public constructor(init?: Partial<Barber>) {
      Object.assign(this, init);
    }
  }

  export class BarberResponse {
    message: string;
    barber: Barber;
  }
}
