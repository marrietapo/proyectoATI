import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Reservations } from 'src/app/dtos/reservations';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Component({
  selector: 'app-next-booking-not-connection-popover',
  templateUrl: './next-booking-not-connection-popover.component.html',
  styleUrls: ['./next-booking-not-connection-popover.component.scss'],
})
export class NextBookingNotConnectionPopoverComponent implements OnInit {
  reservation: Reservations.Reservation;
  dateInFormat: string;

  constructor(private modalCtrl: ModalController, private storage: Storage) {}

  async ngOnInit() {
    this.storage.create();
    this.reservation = new Reservations.Reservation(
      await this.storage.get('nextReservation')
    );
    if(this.reservation){
      this.dateInFormat = moment(this.reservation.date).format('DD/MM/YYYY - HH:mm');
    }
  }

  goBack() {
    this.modalCtrl.dismiss();
  }
}
