import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  group: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private statusBar: StatusBar,
    private platform: Platform,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {});
    this.buildForm();
  }

  buildForm() {
    this.group = this.formBuilder.group({
      name: '',
      lastName: '',
      email: '',
      password: '',
      repeatPassword: '',
    });
  }

  goToLogin() {
    this.navCtrl.navigateForward(`login`);
  }

  async notificationToast(msg: String) {
    const toast = await this.toastController.create({
      message: `${msg}`,
      duration: 2000,
    });
    toast.style.textAlign = 'center';
    await toast.present();

    const { role } = await toast.onDidDismiss();
  }

  register() {
    const name = this.group.get('name')?.value;
    const lastName = this.group.get('lastName')?.value;
    const email = this.group.get('email')?.value;
    const password = this.group.get('password')?.value;
    const repeatPassword = this.group.get('repeatPassword')?.value;
    if (
      name === '' ||
      lastName === '' ||
      email === '' ||
      password === '' ||
      repeatPassword === ''
    ) {
      this.notificationToast('Todos los campos son requeridos');
    } else if (password !== repeatPassword) {
      this.notificationToast('Las contraseñas no coinciden');
    } else {
      this.authService
        .register(email, password, repeatPassword, name, lastName)
        .subscribe(
          (result) => {
            this.goToLogin();
            console.log(result.message);
          },
          (error) => {
            this.notificationToast(error.error.message);
          }
        );
    }
  }

}
