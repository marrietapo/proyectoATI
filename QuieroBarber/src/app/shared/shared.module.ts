import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SkeletonListComponent } from './skeleton-list/skeleton-list.component';
import { MapComponent } from './map/map.component';
import { IonicModule } from '@ionic/angular';
import { MarkerPopupComponent } from './map/marker-popup/marker-popup.component';
import { HowToGoComponent } from './how-to-go/how-to-go.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SkeletonListComponent,
    MapComponent,
    MarkerPopupComponent,
    HowToGoComponent,
  ],
  exports: [
    HeaderComponent,
    SkeletonListComponent,
    MapComponent,
    MarkerPopupComponent,
    HowToGoComponent,
  ],

  imports: [CommonModule, IonicModule],
})
export class SharedModule {}
