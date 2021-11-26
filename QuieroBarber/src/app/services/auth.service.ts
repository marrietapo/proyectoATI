import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../dtos/users';
import { Storage } from '@ionic/storage';
import jwtDecode from 'jwt-decode';
import { Enumerations } from '../dtos/enumerations';
import { NavController } from '@ionic/angular';
import { api } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController
  ) {}

  async isLoggedClient(): Promise<boolean> {
    this.storage.create();

    const tokens = new Users.ResponseLoginUser(
      await this.storage.get('tokens')
    );

    if (!tokens) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>((resolve) => {
      const user = new Users.User(jwtDecode(tokens.accessToken));
      if (user.role === Enumerations.Role.CLIENT) {
        resolve(true);
      } else {
        this.navCtrl.navigateRoot('/login');
        resolve(false);
      }
    });
  }

  async getAccessToken(): Promise<string> {
    this.storage.create();

    const tokens = new Users.ResponseLoginUser(
      await this.storage.get('tokens')
    );

    return new Promise<string>((resolve) => {
      resolve(tokens.accessToken);
    });
  }

  async isLoggedBarber(): Promise<boolean> {
    this.storage.create();

    const tokens = new Users.ResponseLoginUser(
      await this.storage.get('tokens')
    );

    if (!tokens) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>(async (resolve) => {
      const user = new Users.User(jwtDecode(tokens.accessToken));
      if (user.role === Enumerations.Role.BARBERSHOP_OWNER) {
        resolve(true);
      } else {
        this.navCtrl.navigateRoot('/login');
        resolve(false);
      }
    });
  }

  login(email: string, password: string): Observable<Users.ResponseLoginUser> {
    const headers = { 'Content-type': 'application/json' };
    const body = { email, password };
    return this.http.post<Users.ResponseLoginUser>(`${api.path}${api.version}sign-in`,
      body,
      {
        headers,
      }
    );
  }

  register(
    email: string,
    password: string,
    repeatPassword: string,
    name: string,
    lastName: string
  ): Observable<Users.ResponseUserRegister> {
    const headers = { 'Content-type': 'application/json' };
    const body = { email, password, repeatPassword, name, lastName };
    return this.http.post<Users.ResponseUserRegister>(
      `${api.path}${api.version}sign-up-client`,
      body,
      {
        headers,
      }
    );
  }

  logout(): void {
    this.storage.create();
    this.storage.remove('tokens');
    this.navCtrl.navigateRoot('/login');
  }
}
