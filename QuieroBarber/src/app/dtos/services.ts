import { Barbershops } from './barbershops';
import { Enumerations } from './enumerations';

export namespace Services {

  export class Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    active: boolean;
    image: string;
    barbershop: Barbershops.Barbershop;

    public constructor(init?: Partial<Service>) {
      Object.assign(this, init);
    }
  }

  export class ServicesResponse {
    message: string;
    services: Service[];
  }
}
