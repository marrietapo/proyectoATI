import { Time } from '@angular/common';
import { Barbers } from './barbers';
import { Barbershops } from './barbershops';
import { Enumerations } from './enumerations';
import { Services } from './services';
import { Users } from './users';

export namespace Reservations {
  export class ResponseGetReservations {
    message: string;
    reservations: [Reservation];

    public constructor(init?: Partial<ResponseGetReservations>) {
      Object.assign(this, init);
    }
  }

  export class Reservation {
    _id: string;
    service: [Services.Service];
    barbershop: Barbershops.Barbershop;
    user: Users.User;
    date: Date;
    barber: Barbers.Barber;
    created: Date;
    totalAmount: number;
    active: boolean;
    slot: Number;

    public constructor(init?: Partial<Reservation>) {
      Object.assign(this, init);
    }
  }

  export class ReservationResponse {
    message: string;
    reservation: Reservation;

    public constructor(init?: Partial<ReservationResponse>) {
      Object.assign(this, init);
    }
  }

  export class ReservationsResponse {
    message: string;
    reservations: Reservation[];

    public constructor(init?: Partial<ReservationsResponse>) {
      Object.assign(this, init);
    }
  }

  export class ScheduleHour {
    date: Date;
    dateDisplayFrom: string;
    dateDisplayUntil: string;
    slot: number;
    slotType: SlotType;
  }

  export enum SlotType {
    available = 1,
    notAvailable = 2,
    userReservation = 3,
  }
}
