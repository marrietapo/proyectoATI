import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api } from 'src/environments/environment.prod';
import { Barbershops } from '../dtos/barbershops';
import { Comments } from '../dtos/comments';
import { Services } from '../dtos/services';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root',
})
export class LocalsService {
  constructor(private http: HttpClient ) {}

  getLocals(token: string): Observable<Barbershops.BarbershopsResponse> {
    const url = `${api.path}${api.version}get-barbershops-active?active=true`;
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    return this.http.get<Barbershops.BarbershopsResponse>(url, params);
  }

  getLocalDetails(
    token: string,
    id: string
  ): Observable<Barbershops.BarbershopResponse> {
    const url = `${api.path}${api.version}get-barbershop/${id}`;
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    return this.http.get<Barbershops.BarbershopResponse>(url, params);
  }

  getLocalServices(
    token: string,
    id: string
  ): Observable<Services.ServicesResponse> {
    const url = `${api.path}${api.version}get-services-active?active=true&barbershop=${id}`;
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    return this.http.get<Services.ServicesResponse>(url, params);
  }

  getLocalComments(
    token: string,
    id: string
  ): Observable<Comments.CommentsResponse> {
    const url = `${api.path}${api.version}get-comments-by-barbershop/${id}`;
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    return this.http.get<Comments.CommentsResponse>(url, params);
  }

  addLocalComment(
    token: string,
    userId: string,
    comm: string,
    rate: number,
    barbershopId: string
  ): Observable<any> {
    const headers = {
      'Content-type': 'application/json',
      Authorization: token,
    };
    const body = { userId, comm, rate, barbershopId };
    return this.http.post<any>(`${api.path}${api.version}add-comment`, body, {
      headers,
    });
  }

}
