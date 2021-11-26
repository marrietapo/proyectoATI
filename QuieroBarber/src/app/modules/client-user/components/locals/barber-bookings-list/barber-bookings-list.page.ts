import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Barbers } from 'src/app/dtos/barbers';
import { AuthService } from 'src/app/services/auth.service';
import { BarbersService } from 'src/app/services/barbers.service';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';

@Component({
  selector: 'app-barber-bookings-list',
  templateUrl: './barber-bookings-list.page.html',
  styleUrls: ['./barber-bookings-list.page.scss'],
})
export class BarberBookingsListPage implements OnInit {
  barber: Barbers.Barber;
  @ViewChild('scheduleList', { read: ScheduleListComponent })
  scheduleList: ScheduleListComponent;

  dateValue = moment().format().split('T')[0];
  today = moment().format().split('T')[0];
  showOneDayBack: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private barbersService: BarbersService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.route.params.subscribe(async (params) => {
      const id = params['id'];
      this.barbersService
        .getBarberDetails(await this.authService.getAccessToken(), id)
        .subscribe(
          (result) => {
            this.barber = result.barber;
          },
          (error) => {
            console.error(error);
          }
        );
    });
  }

  async oneDayForward() {
    var newDate = new Date(Date.parse(this.dateValue));
    newDate.setDate(newDate.getDate() + 1);
    this.dateValue = newDate.toISOString().split('T')[0];
    this.showOneDayBack = this.dateValue > this.today;
  }

  async oneDayBack() {
    var newDate = new Date(Date.parse(this.dateValue));
    newDate.setDate(newDate.getDate() - 1);
    this.dateValue = newDate.toISOString().split('T')[0];
    this.showOneDayBack = this.dateValue > this.today;
  }

  async setManualDate(event) {
    var newDate = new Date(Date.parse(event.detail.value));
    this.dateValue = newDate.toISOString().split('T')[0];
    this.showOneDayBack = this.dateValue > this.today;
    await this.scheduleList.calculateSchedule(this.dateValue);
  }
}
