import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  ModalController,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { Reservations } from 'src/app/dtos/reservations';
import { Barbers } from 'src/app/dtos/barbers';
import { Users } from 'src/app/dtos/users';
import { Services } from 'src/app/dtos/services';
import { imagesUrl } from 'src/environments/environment.prod';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { ReservationService } from 'src/app/services/reservation.service';
import { AuthService } from 'src/app/services/auth.service';
import { BarberInfoComponent } from '../booking-details/barber-info/barber-info.component';
import { ServiceInfoComponent } from '../booking-details/service-info/service-info.component';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import jwtDecode from 'jwt-decode';
import { HowToGoComponent } from 'src/app/shared/how-to-go/how-to-go.component';
import { Barbershops } from 'src/app/dtos/barbershops';
import { InstructionsInfoComponent } from './instructions-info/instructions-info.component';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss'],
})
export class BookingDetailsComponent implements OnInit {
  @Input() reservationId: string;
  reservation: Reservations.Reservation;
  loading = false;
  token: string;
  user_id: string;

  constructor(
    private modalCtrl: ModalController,
    private reservationService: ReservationService,
    private authService: AuthService,
    public popoverController: PopoverController,
    public toastController: ToastController,
    private storage: Storage,
    public actionSheetController: ActionSheetController,
    private localNotifications: LocalNotifications,
    private network: Network
  ) {}

  ngOnInit() {
    this.getData();
  }

  ionViewDidEnter() {
    this.storage.get('tokens').then((result) => {
      const userStoredData = new Users.ResponseLoginUser(result);
      this.token = userStoredData.accessToken;
      this.user_id = new Users.User(jwtDecode(userStoredData.accessToken))._id;
    });
  }

  suscribeLocalNotification(reservation: Reservations.Reservation) {
    this.suscribeLocalNotificationLater(reservation);
    this.suscribeLocalNotificationNow(reservation);
  }

  suscribeLocalNotificationLater(reservation: Reservations.Reservation) {
    var hour = moment(reservation.date).format('HH:mm');
    var reservationDate = moment(reservation.date)
      .add(-1, 'hours')
      .subtract(moment().utcOffset(), 'minutes')
      .format('MM-DD-YYYY HH:mm');
    this.localNotifications.schedule({
      title: `${reservation.barbershop.name}`,
      text: `Hola amig@! 🤙🗓️ Recuerda que tienes una reserva programada para ${reservation.barbershop.name}, el día de hoy a las ${hour} horas. Te esperamos!`,
      trigger: { at: new Date(reservationDate) },
      led: 'FF0000',
      vibrate: true,
      icon: this.getLogoURL(reservation.barbershop.logo),
      smallIcon: 'res://calendar',
    });
    this.notificationToast();
  }
  suscribeLocalNotificationNow(reservation: Reservations.Reservation) {
    var hour = moment(reservation.date).format('HH:mm');
    var day = moment(reservation.date).format('L');
    this.localNotifications.schedule({
      title: `${reservation.barbershop.name}`,
      text: `Hola amig@! 🤙🗓️ Recuerda que tienes una reserva programada para ${reservation.barbershop.name}, el día ${day} a las ${hour} horas. Te esperamos!`,
      trigger: { at: new Date() },
      led: 'FF0000',
      icon: this.getLogoURL(reservation.barbershop.logo),
      smallIcon: 'res://calendar',
      sound: null,
      vibrate: true,
    });
    this.notificationToast();
  }

  async showHowToGo(barbershop: Barbershops.Barbershop) {
    const modal = await this.modalCtrl.create({
      component: HowToGoComponent,
      componentProps: {
        barbershop,
      },
    });
    modal.present();
  }

  getLogoURL(image) {
    return imagesUrl.barbershopLogo + image;
  }

  async getData() {
    const id = this.reservationId;
    this.reservationService
      .getReservationDetails(await this.authService.getAccessToken(), id)
      .subscribe((result) => {
        this.reservation = result.reservation;
        this.loading = true;
      });
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

  getBarberAvatarURL(image) {
    if (image) {
      return imagesUrl.barberAvatar + image;
    } else {
      return '../../../../../../assets/img/no-avatar.png';
    }
  }

  getServiceImageURL(image) {
    if (image) {
      return imagesUrl.serviceImage + image;
    } else {
      return '../../../../../../assets/img/no-avatar.png';
    }
  }

  getBarbershopLogoURL(image) {
    return imagesUrl.barbershopLogo + image;
  }

  applyDateFormat(date) {
    moment.locale('es');
    return moment(date).format('LL');
  }

  getHours(date) {
    moment.locale('es');
    return moment(date).format('LT');
  }

  async presentBarberPopover(element: Barbers.Barber) {
    const popover = await this.popoverController.create({
      component: BarberInfoComponent,
      componentProps: { element },
      cssClass: 'my-custom-class',
      translucent: true,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  thisReservationIsOld(reservation: Reservations.Reservation) {
    return moment(reservation.date).toDate() < moment().toDate();
  }

  async presentServicePopover(element: Services.Service) {
    const popover = await this.popoverController.create({
      component: ServiceInfoComponent,
      componentProps: { element },
      cssClass: 'my-custom-class',
      translucent: true,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async deletedToast(reservationId) {
    const toast = await this.toastController.create({
      message: 'Reserva eliminada correctamente.',
      duration: 2000,
    });
    toast.style.textAlign = 'center';
    await toast.present();

    const { role } = await toast.onDidDismiss();
  }

  async notificationToast() {
    const toast = await this.toastController.create({
      message: 'Notificación programada correctamente.',
      duration: 2000,
    });
    toast.style.textAlign = 'center';
    await toast.present();

    const { role } = await toast.onDidDismiss();
  }

  deleteReservation(reservationId) {
    this.reservationService
      .deleteReservationApi(this.token, reservationId)
      .then(
        (result) => {
          if (result) {
            this.deletedToast(reservationId);
            this.goBack();
          }
        },
        (error) => {
          this.storage.clear();
          console.error(error);
        }
      );
  }

  async presentActionSheet(barbershopId) {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Desea eliminar su reserva?',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteReservation(barbershopId);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
