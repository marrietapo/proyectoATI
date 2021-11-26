import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { Reservations } from '../dtos/reservations';
import { api } from 'src/environments/environment.prod';
import { Users } from '../dtos/users';
import jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import { DatetimeOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  token: string;
  _id: string;
  userStoredData: Users.ResponseLoginUser;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: Storage
  ) {}

  getReservationsApi(token, user) {
    const url = `${api.path}${api.version}get-reservations-by-user/${user}`;
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    return fetch(url, params)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return error.message;
      });
  }

  getNextReservation(
    token: string,
    user: string
  ): Observable<Reservations.ReservationResponse> {
    const url = `${api.path}${api.version}get-next-reservation/${user}`;
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    return this.http.get<Reservations.ReservationResponse>(url, params);
  }

  deleteReservationApi(token, itemId) {
    const url = `${api.path}${api.version}delete-reservation/${itemId}`;
    const params = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    return fetch(url, params)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        return result.message;
      })
      .catch((error) => {
        return error.message;
      });
  }

  getReservationDetails(
    token: string,
    id: string
  ): Observable<Reservations.ReservationResponse> {
    const url = `${api.path}${api.version}get-reservation/${id}`;
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    return this.http.get<Reservations.ReservationResponse>(url, params);
  }

  getBarberBookingsListByDate(
    token: string,
    barberId: string,
    date: Date
  ): Observable<Reservations.ReservationsResponse> {
    const url = `${api.path}${
      api.version
    }get-reservations-by-date-and-barber?barber=${barberId}&date=${moment(date)
      .utcOffset(0)
      .format('YYYY-MM-DD')}`;
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    return this.http.get<Reservations.ReservationsResponse>(url, params);
  }

  createReservation(
    token: string,
    date: Date,
    service: string[],
    barber: string,
    barbershop: string,
    slot: number,
    totalAmount: number
  ): Observable<any> {
    const headers = {
      'Content-type': 'application/json',
      Authorization: token,
    };
    const body = { date, service, barber, barbershop, slot, totalAmount };
    return this.http.post<any>(
      `${api.path}${api.version}add-reservation`,
      body,
      {
        headers,
      }
    );
  }
}
