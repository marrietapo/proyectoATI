import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import jwtDecode from 'jwt-decode';
import { Users } from '../dtos/users';
import { Storage } from '@ionic/storage';
import { api } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private http: HttpClient,
    private fileTransfer: FileTransfer
  ) {}

  async getUserInfo(): Promise<Users.User> {
    this.storage.create();

    const tokens = new Users.ResponseLoginUser(
      await this.storage.get('tokens')
    );

    if (!tokens) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(null);
    }

    return new Promise<Users.User>((resolve) => {
      const user = new Users.User(jwtDecode(tokens.accessToken));
      resolve(user);
    });
  }

  async updateUserApi(newData) {
    var us = await this.getUserInfo();
    const tokens = new Users.ResponseLoginUser(
      await this.storage.get('tokens')
    );
    console.log(tokens.accessToken);

    const url = `${api.path}${api.version}update-user/${us._id}`;
    const params = {
      method: 'PUT',
      body: JSON.stringify(newData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: tokens.accessToken,
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

  getUserById(token: string): Observable<Users.ResponseUserRegister> {
    const url = `${api.path}${api.version}get-user/`;
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    return this.http.get<Users.ResponseUserRegister>(url, params);
  }

  uploadAvatar(img: string, token: string, userId: string) {
    const url = `${api.path}${api.version}upload-avatar/${userId}`;
    const options: FileUploadOptions = {
      fileKey: 'avatarName',
      httpMethod: 'PUT',
      mimeType: 'image/jpg',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    fileTransfer
      .upload(img, url, options)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
