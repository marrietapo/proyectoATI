import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Barbershops } from 'src/app/dtos/barbershops';
import { imagesUrl } from 'src/environments/environment.prod';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-marker-popup',
  templateUrl: './marker-popup.component.html',
  styleUrls: ['./marker-popup.component.scss'],
})
export class MarkerPopupComponent implements OnInit {
  @Input() element: Barbershops.Barbershop;
  @Output() event = new EventEmitter<any>();

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit() {}

  getBarbershopLogoURL(image) {
    if (image) {
      return imagesUrl.barbershopLogo + image;
    } else {
      return '../../assets/img/no-avatar.png';
    }
  }

  goToLocalsDetails() {
    this.navCtrl.navigateForward(`client/tabs/locals/${this.element._id}`);
    this.popoverCtrl.dismiss();
  }

  processEvent() {
    this.event.emit('evento disparado');
  }
}
