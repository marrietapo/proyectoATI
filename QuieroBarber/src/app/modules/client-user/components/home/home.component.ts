import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/dtos/users';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import {
  ModalController,
  NavController,
  Platform,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ReservationService } from 'src/app/services/reservation.service';
import { Reservations } from 'src/app/dtos/reservations';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import * as moment from 'moment';
import { BookingDetailsComponent } from '../bookings/booking-details/booking-details.component';
import { imagesUrl } from 'src/environments/environment.prod';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { NextBookingNotConnectionPopoverComponent } from './next-booking-not-connection-popover/next-booking-not-connection-popover.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: Users.User;
  loading: boolean = true;
  reservation: Reservations.Reservation;
  loadingNextReservation = true;
  base64Image: string;
  avatar: string;
  imageChange: boolean = false;
  imgData: any;

  optionsCamera: CameraOptions = {
    quality: 60,
    //allowEdit: true,
    sourceType: this.camera.PictureSourceType.CAMERA,
    //saveToPhotoAlbum: true,
    correctOrientation: true,
    encodingType: this.camera.EncodingType.JPEG,
    destinationType: this.camera.DestinationType.FILE_URI,
    mediaType: this.camera.MediaType.PICTURE,
  };

  optionsGallery: CameraOptions = {
    quality: 60,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    correctOrientation: true,
    encodingType: this.camera.EncodingType.JPEG,
    destinationType: this.camera.DestinationType.FILE_URI,
    mediaType: this.camera.MediaType.PICTURE,
  };

  constructor(
    private authService: AuthService,
    private geolocation: Geolocation,
    private userService: UsersService,
    private platform: Platform,
    private diagnostic: Diagnostic,
    private reservationService: ReservationService,
    private firebaseX: FirebaseX,
    private modalCtrl: ModalController,
    private camera: Camera,
    private navCtrl: NavController,
    private file: File,
    private storage: Storage,
    private network: Network,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.displayNextBookingWithoutConnection();
  }

  async ionViewDidEnter() {
    this.getUserData();
    this.initFirebaseConfiguration();
    this.getNextReservations();
    this.imageChange = false;
  }

  initFirebaseConfiguration() {
    this.firebaseX
      .getToken()
      .then((token) => {
        this.userService.updateUserApi({ notificationToken: token });
      })
      .catch((error) => console.error('Error getting token', error));

    this.firebaseX
      .onMessageReceived()
      .subscribe((data) => console.log(`User opened a notification ${data}`));

    this.firebaseX
      .onTokenRefresh()
      .subscribe((token: string) => console.log(`Got a new token ${token}`));
  }

  ionViewWillEnter() {
    this.checkPermission();
    this.getNextReservations();
  }

  async getUserData() {
    this.user = await this.userService.getUserInfo();
    this.loading = false;
    if (this.user.avatar) {
      this.avatar = imagesUrl.userAvatar + this.user.avatar;
    } else {
      this.avatar = '../../../../../assets/img/no-avatar.png';
    }
  }

  logout(): void {
    this.authService.logout();
  }

  checkPermission() {
    this.platform.ready().then(() => {
      this.diagnostic
        .getLocationAuthorizationStatus()
        .then((state) => {
          if (state == this.diagnostic.permissionStatus.NOT_REQUESTED) {
            this.requestLocationAuthorization();
          } else {
          }
        })
        .catch((e) => console.error(e));
    });
  }

  requestLocationAuthorization() {
    this.diagnostic
      .requestLocationAuthorization()
      .then((res) => {
        this.checkPermission();
      })
      .catch((e) => console.log(e));
  }
  getLocation() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {})
      .catch((error) => {
        console.log('Error getting location', error);
        this.loading = false;
      });
  }

  async getNextReservations() {
    const user = await this.userService.getUserInfo();
    await this.reservationService
      .getNextReservation(await this.authService.getAccessToken(), user._id)
      .subscribe((result) => {
        this.storage.set('nextReservation', result.reservation);
        this.reservation = result.reservation;
        this.loadingNextReservation = false;
      });
  }

  formatDate(date: Date) {
    return moment(date).format('DD/MM/YYYY - HH:mm');
  }

  async goToDetails(reservationId) {
    const modal = await this.modalCtrl.create({
      component: BookingDetailsComponent,
      componentProps: {
        reservationId,
      },
    });
    modal.present();
  }

  getUserAvatarURL(avatar) {
    imagesUrl.userAvatar + avatar;
    return imagesUrl.userAvatar + avatar;
  }

  getCamera() {
    this.imageChange = false;
    this.camera.getPicture(this.optionsCamera).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        if (imageData) {
          let filename = imageData.substring(imageData.lastIndexOf('/') + 1);
          let path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
          //then use the method reasDataURL  btw. var_picture is ur image variable
          this.file
            .readAsDataURL(path, filename)
            .then((res) => (this.avatar = res));
          //'data:image/jpeg;base64,'
          this.imgData = imageData;
          this.imageChange = true;
        }
      },
      (err) => {
        console.error(err);
        // Handle error
      }
    );
  }

  getGallery() {
    this.imageChange = false;
    this.camera.getPicture(this.optionsGallery).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        if (imageData) {
          this.avatar = (<any>window).Ionic.WebView.convertFileSrc(imageData);
          this.imgData = imageData;
          this.imageChange = true;
        }
      },
      (err) => {
        console.error(err);
        // Handle error
      }
    );
  }

  async savePhoto() {
    this.userService.uploadAvatar(
      this.imgData,
      await this.authService.getAccessToken(),
      this.user._id
    );
  }

  goToFavourites() {
    this.navCtrl.navigateForward(`client/tabs/home/favourites`);
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

  async popOverNoConnection() {
    const modal = await this.modalCtrl.create({
      component: NextBookingNotConnectionPopoverComponent,
      cssClass: 'my-custom-class',
    });
    await modal.present();
  }

  displayNextBookingWithoutConnection() {
    this.storage.create();
    let disconnectSubscription = this.network
      .onDisconnect()
      .subscribe(async () => {
        this.notificationToast('Sin conexión');
        this.reservation = new Reservations.Reservation(
          await this.storage.get('nextReservation')
        );
        if (this.reservation) {
          this.popOverNoConnection();
        }
        this.loadingNextReservation = false;
      });
  }
}
