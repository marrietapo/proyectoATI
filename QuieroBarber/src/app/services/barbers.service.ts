import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api } from 'src/environments/environment.prod';
import { Barbers } from '../dtos/barbers';

@Injectable({
  providedIn: 'root',
})
export class BarbersService {
  constructor(private http: HttpClient) {}

  getBarberDetails(
    token: string,
    id: string
  ): Observable<Barbers.BarberResponse> {
    const url = `${api.path}${api.version}get-barber/${id}`;
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    return this.http.get<Barbers.BarberResponse>(url, params);
  }
}
