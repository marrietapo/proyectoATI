import { Component, OnDestroy, OnInit   } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Barbershops } from 'src/app/dtos/barbershops';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalInfoComponent } from './modal-info/modal-info.component';
import { LocalsService } from 'src/app/services/locals.service';
import { AuthService } from 'src/app/services/auth.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.scss'],
})
export class MapScreenComponent implements OnInit {
  location = {};
  loading = true;
  barbershops: Barbershops.Barbershop[] = [];
  locState: boolean;

  constructor(
    private geolocation: Geolocation,
    private modalCtrl: ModalController,
    private localsService: LocalsService,
    private authService: AuthService,
    private diagnostic: Diagnostic,
    private toastController: ToastController,
    private platform: Platform
  ) {}

  async ngOnInit() {
    await this.requestLocationAuthorization();
    this.getBarbershops();

    if (!(await this.checkWifiStatus)) {
      this.wifiNotAvailableToast();
    }
  }

  async checkWifiStatus() {
    await this.diagnostic.isWifiAvailable();
  }

  async wifiNotAvailableToast() {
    const toast = await this.toastController.create({
      message: 'Servicio de wifi desactivado.',
      duration: 2000,
    });
    toast.style.textAlign = 'center';
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  checkPermission() {
    this.platform.ready().then(() => {
      this.diagnostic
        .getLocationAuthorizationStatus()
        .then((state) => {
          if (
            state == this.diagnostic.permissionStatus.GRANTED ||
            state == this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE
          ) {
            this.locState = true;
            this.getLocation();
          } else if (
            state == this.diagnostic.permissionStatus.DENIED_ALWAYS ||
            state == this.diagnostic.permissionStatus.DENIED_ONCE
          ) {
            this.notificationToast();
          } else if (state == this.diagnostic.permissionStatus.NOT_REQUESTED) {
            this.locState = false;
            this.requestLocationAuthorization();
          } else {
          }
        })
        .catch((e) => console.error(e));
    });
  }

  ionViewDidEnter() {
    this.getLocation();
  }

  ionViewWillEnter() {
    this.checkPermission();
    this.getLocation();
  }

  requestLocationAuthorization() {
    this.diagnostic
      .requestLocationAuthorization()
      .then((res) => {
        this.checkPermission();
      })
      .catch((e) => console.log(e));
  }

  async notificationToast() {
    const toast = await this.toastController.create({
      message: 'No hay autorización para acceder a su ubicación.',
      duration: 2000,
    });
    toast.style.textAlign = 'center';
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  getLocation() {
    if (this.locState) {
      this.geolocation
        .getCurrentPosition()
        .then((resp) => {
          this.location = [
            Number(resp.coords.longitude),
            Number(resp.coords.latitude),
          ];
        })
        .catch((error) => {
          console.log('Error getting location', error);
          this.loading = false;
        });
    } else {
      this.checkPermission();
    }
  }

  async goToDetails(barbershop: Barbershops.Barbershop) {
    const modal = await this.modalCtrl.create({
      component: ModalInfoComponent,
      componentProps: {
        barbershop,
      },
    });
    modal.present();
  }

  async getBarbershops() {
    this.localsService
      .getLocals(await this.authService.getAccessToken())
      .subscribe(
        (result) => {
          this.barbershops = result.barbershops;
          this.loading = false;
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
