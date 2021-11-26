import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientUserRoutingModule } from './client-user-routing.module';
import { TabsMenuComponent } from './components/tabs-menu/tabs-menu.component';
import { IonicModule } from '@ionic/angular';
import { BookingsModule } from './components/bookings/bookings.module';
import { MapScreenModule } from './components/map-screen/map-screen.module';
import { LocalsModule } from './components/locals/locals.module';
import { HomeModule } from './components/home/home.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SharedModule } from 'src/app/shared/shared.module';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';



@NgModule({
  declarations: [TabsMenuComponent],
  imports: [
    CommonModule,
    ClientUserRoutingModule,
    IonicModule,
    SharedModule,
    HomeModule,
    LocalsModule,
    BookingsModule,
    MapScreenModule
  ],
  providers: [Geolocation, StatusBar],
})
export class ClientUserModule {}
