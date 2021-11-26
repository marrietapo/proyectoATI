import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Barbers } from 'src/app/dtos/barbers';
import SwiperCore, { Pagination, SwiperOptions } from 'swiper';
import { imagesUrl } from 'src/environments/environment.prod';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.scss'],
})
export class ManageBookingComponent implements OnInit {
  currentUrl: string;
  @Input() barbers: Barbers.Barber[];

  config: SwiperOptions = {
    slidesPerView: 2,
    spaceBetween: 6,
    pagination: { clickable: true },
  };

  constructor(private navCtrl: NavController, private router: Router) {}

  ngOnInit() {
    this.currentUrl = this.router.url;
  }

  goToBooking(id: string) {
    this.navCtrl.navigateForward(`${this.currentUrl}/barber/${id}`);
  }

  getBarberAvatarURL(image) {
    if (image) {
      return imagesUrl.barberAvatar + image;
    } else {
      return '../../../../../../../assets/img/no-avatar.png';
    }
  }
}
