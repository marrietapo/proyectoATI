import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { BookingListComponent } from './bookings-list/booking-list.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from './../../../../shared/shared.module';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { InstructionsInfoComponent } from './booking-details/instructions-info/instructions-info.component';
import { Network } from '@ionic-native/network/ngx';

@NgModule({
  declarations: [
    BookingListComponent,
    BookingDetailsComponent,
    InstructionsInfoComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: BookingListComponent },
      { path: ':id', component: BookingDetailsComponent },
    ]),
  ],
  providers: [LocalNotifications, Vibration, Geolocation, Network],
})
export class BookingsModule {}
