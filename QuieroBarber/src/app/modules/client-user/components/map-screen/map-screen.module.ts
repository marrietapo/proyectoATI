import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapScreenComponent } from './map-screen.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalInfoComponent } from './modal-info/modal-info.component';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@NgModule({
  declarations: [MapScreenComponent, ModalInfoComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: MapScreenComponent },
      { path: ':id', component: ModalInfoComponent },
    ]),
  ],
  providers: [Geolocation, Diagnostic],
})
export class MapScreenModule {}
