import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/dtos/users';
import { ReservationService } from 'src/app/services/reservation.service';
import { Storage } from '@ionic/storage';
import jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import { imagesUrl } from 'src/environments/environment.prod';
import { Reservations } from 'src/app/dtos/reservations';
import { ModalController } from '@ionic/angular';
import { BookingDetailsComponent } from '../booking-details/booking-details.component';
import { ActionSheetController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent implements OnInit {
  loading: boolean = true;
  token: string;
  user_id: string;
  reservations: Reservations.Reservation[] = [];
  futureReservations: Reservations.Reservation[] = [];
  pastReservations: Reservations.Reservation[] = [];

  constructor(
    private reservationService: ReservationService,
    private storage: Storage,
    private modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private localNotifications: LocalNotifications
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.futureReservations;
    this.storage.get('tokens').then((result) => {
      const userStoredData = new Users.ResponseLoginUser(result);
      this.token = userStoredData.accessToken;
      this.user_id = new Users.User(jwtDecode(userStoredData.accessToken))._id;
      this.getReservations(this.token, this.user_id);
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
    var reservationDate = moment(reservation.date)
      .add(-1, 'hours')
      .subtract(moment().utcOffset(), 'minutes')
      .format('MM DD YYYY HH:mm');
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

  getReservations(token, user) {
    this.reservationService.getReservationsApi(token, user).then(
      (result) => {
        if (result.reservations) {
          this.reservations = result.reservations;
          this.futureReservations = this.reservations.filter(
            (x) => moment(x.date).format() > moment().format()
          );
          this.pastReservations = this.reservations.filter(
            (x) => moment(x.date).format() < moment().format()
          );
          this.loading = false;
        }
      },
      (error) => {
        this.storage.clear();
        this.loading = false;
        console.error(error);
      }
    );
  }

  deleteReservation(reservationId) {
    this.reservationService
      .deleteReservationApi(this.token, reservationId)
      .then(
        (result) => {
          if (result) {
            document
              .getElementById(`${reservationId}`)
              .classList.add('slide-out-right');
            this.getReservations(this.token, this.user_id);
            this.deletedToast(reservationId);
          }
        },
        (error) => {
          this.storage.clear();
          console.error(error);
        }
      );
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

  async goToDetails(reservationId: string) {
    const modal = await this.modalCtrl.create({
      component: BookingDetailsComponent,
      componentProps: {
        reservationId
      },
    });
    modal.onDidDismiss().then(() => {
      this.getReservations(this.token, this.user_id);
    });
    modal.present();
  }

  applyDateFormat(date) {
    moment.locale('es');
    return moment(date).format('LL');
  }

  getHours(date) {
    moment.locale('es');
    return moment(date).format('LT');
  }

  getLogoURL(image) {
    return imagesUrl.barbershopLogo + image;
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
