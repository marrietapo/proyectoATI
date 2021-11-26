import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { HowToGoComponent } from 'src/app/shared/how-to-go/how-to-go.component';
import { Camera } from '@ionic-native/camera/ngx';
import { LocalDetailsComponent } from '../locals/local-details/local-details.component';
import { FavouritesListComponent } from './favourites-list/favourites-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { SkeletonListComponent } from 'src/app/shared/skeleton-list/skeleton-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Network } from '@ionic-native/network/ngx';
import { NextBookingNotConnectionPopoverComponent } from './next-booking-not-connection-popover/next-booking-not-connection-popover.component';

@NgModule({
  declarations: [
    HomeComponent,
    FavouritesListComponent,
    NextBookingNotConnectionPopoverComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IonicModule,
    SharedModule,
    IonicStorageModule.forRoot(),
    RouterModule.forChild([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      {
        path: 'favourites',
        component: FavouritesListComponent,
        pathMatch: 'full',
      },
    ]),
  ],
  providers: [
    Geolocation,
    Diagnostic,
    LocalNotifications,
    Camera,
    Storage,
    FileTransfer,
    File,
    Network,
  ],
})
export class HomeModule {}
