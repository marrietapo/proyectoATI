import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalsListComponent } from './locals-list/locals-list.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LocalDetailsComponent } from './local-details/local-details.component';
import { ManageBookingComponent } from './local-details/manage-booking/manage-booking.component';
import { GalleryComponent } from './local-details/gallery/gallery.component';
import { SwiperModule } from 'swiper/angular';
import { BarberBookingsListPage } from './barber-bookings-list/barber-bookings-list.page';
import { ScheduleListComponent } from './barber-bookings-list/schedule-list/schedule-list.component';
import { SelectServicesDialogComponent } from './barber-bookings-list/schedule-list/select-services-dialog/select-services-dialog.component';
import { CommentsListComponent } from './local-details/comments-list/comments-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StarRatingModule } from 'ionic5-star-rating';
import { HTTP } from '@ionic-native/http/ngx';
import { ResponseMessageComponent } from './barber-bookings-list/schedule-list/select-services-dialog/response-message/response-message.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    LocalsListComponent,
    LocalDetailsComponent,
    ManageBookingComponent,
    GalleryComponent,
    BarberBookingsListPage,
    ScheduleListComponent,
    SelectServicesDialogComponent,
    CommentsListComponent,
    ResponseMessageComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    StarRatingModule,
    RouterModule.forChild([
      { path: '', component: LocalsListComponent, pathMatch: 'full' },
      { path: ':id', component: LocalDetailsComponent, pathMatch: 'full' },
      {
        path: ':id/barber/:id',
        component: BarberBookingsListPage,
        pathMatch: 'full',
      },
    ]),
  ],
  providers: [HTTP],
})
export class LocalsModule {}
