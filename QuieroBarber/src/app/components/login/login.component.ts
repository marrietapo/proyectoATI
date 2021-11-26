import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import jwtDecode from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';
import { Storage } from '@ionic/storage';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { Users } from 'src/app/dtos/users';
import { Enumerations } from 'src/app/dtos/enumerations';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  group: FormGroup;
  user: Users.User = null;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private navCtrl: NavController,
    private toastController: ToastController,
    private statusBar:StatusBar
  ) {}

  async ngOnInit() {
    this.buildForm();
    if (await this.authService.isLoggedClient()) {
      this.navCtrl.navigateRoot('/client');
    } else if (await this.authService.isLoggedBarber()) {
      this.navCtrl.navigateRoot('/barber');
    }
  }

  login() {
    this.storage.create();
    const email = this.group.get('emailLogin')?.value;
    const password = this.group.get('passwordLogin')?.value;
    if (email === '' || password === '') {
      this.notificationToast('Todos los campos son requeridos');
    } else {
      this.authService.login(email, password).subscribe(
        (result) => {
          this.storage.set('tokens', result);
          this.user = new Users.User(jwtDecode(result.accessToken));
          if (this.user.role === Enumerations.Role.CLIENT) {
            this.navCtrl.navigateRoot('client');
          } else {
            this.navCtrl.navigateRoot('barber');
          }
        },
        (error) => {
          this.storage.clear();
          this.notificationToast(error.error.message);
        }
      );
    }
  }

  async notificationToast(msg: String) {
    const toast = await this.toastController.create({
      message: `${msg}`,
      duration: 2000,
    });
    toast.style.textAlign = 'center';
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  goToRegister() {
    this.navCtrl.navigateForward(`register`);
  }

  buildForm() {
    this.group = this.formBuilder.group({
      emailLogin: '',
      passwordLogin: '',
    });
  }
}
