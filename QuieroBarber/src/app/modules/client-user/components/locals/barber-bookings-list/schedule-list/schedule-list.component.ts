import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Barbers } from 'src/app/dtos/barbers';
import { Reservations } from 'src/app/dtos/reservations';
import { Users } from 'src/app/dtos/users';
import { AuthService } from 'src/app/services/auth.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { UsersService } from 'src/app/services/users.service';
import { SelectServicesDialogComponent } from './select-services-dialog/select-services-dialog.component';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss'],
})
export class ScheduleListComponent implements OnInit {
  @Input() requestedDate: string;
  @Input() barber: Barbers.Barber;

  barberReservations: Reservations.Reservation[];
  scheduleHours: Reservations.ScheduleHour[] = [];
  user: Users.User;

  slotType: typeof Reservations.SlotType = Reservations.SlotType;

  constructor(
    private authService: AuthService,
    private reservationService: ReservationService,
    private userService: UsersService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    console.log('onInit');
    await this.calculateSchedule(this.requestedDate);
  }

  async ionViewDidEnter() {}

  async calculateSchedule(date: string) {
    this.scheduleHours = new Array();
    var newDate = moment(date);

    console.log(date);
    console.log(newDate);
    this.reservationService
      .getBarberBookingsListByDate(
        await this.authService.getAccessToken(),
        this.barber._id,
        newDate.toDate()
      )
      .subscribe(
        async (result) => {
          this.barberReservations = result.reservations;
          this.user = await this.userService.getUserInfo();
          var fromEdited = moment(newDate)
            .hours(moment(this.barber.from).hours())
            .minutes(moment(this.barber.from).minutes());

          var untilEdited = moment(newDate)
            .hours(moment(this.barber.until).hours())
            .minutes(moment(this.barber.until).minutes())
            .subtract(30, 'minutes');

          var slot = 0;
          while (fromEdited.toDate() <= untilEdited.toDate()) {
            var scheduleHour = new Reservations.ScheduleHour();
            scheduleHour.date = fromEdited.toDate();
            scheduleHour.dateDisplayFrom = moment(fromEdited).format('HH:mm');
            scheduleHour.slot = slot;
            var filteredReservation = this.barberReservations.find(
              (bR) => bR.slot === slot
              );
              if (filteredReservation) {
                if (filteredReservation.user._id === this.user._id) {
                  scheduleHour.slotType = Reservations.SlotType.userReservation;
                } else {
                  scheduleHour.slotType = Reservations.SlotType.notAvailable;
                }
              } else {
                scheduleHour.slotType = Reservations.SlotType.available;
              }
              this.scheduleHours.push(scheduleHour);
              slot++;
              fromEdited = fromEdited.add(30, 'minutes');
              scheduleHour.dateDisplayUntil = moment(fromEdited).format('HH:mm');
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  async goToSelectServices(scheduleHour: Reservations.ScheduleHour) {
    var barberId = this.barber._id;
    var barbershopId = this.barber.barbershop._id;
    const modal = await this.modalCtrl.create({
      component: SelectServicesDialogComponent,
      componentProps: {
        scheduleHour,
        barberId,
        barbershopId,
      },
    });
    modal.onDidDismiss().then(() => {
     this.calculateSchedule(this.requestedDate);
   });
    modal.present();

  }
}
