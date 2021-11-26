import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Barbershops } from 'src/app/dtos/barbershops';
import { Reservations } from 'src/app/dtos/reservations';
import { AuthService } from 'src/app/services/auth.service';
import { LocalsService } from 'src/app/services/locals.service';
import { imagesUrl } from 'src/environments/environment.prod';

@Component({
  selector: 'app-locals-list',
  templateUrl: './locals-list.component.html',
  styleUrls: ['./locals-list.component.scss'],
})
export class LocalsListComponent implements OnInit {
  locals: Barbershops.Barbershop[] = new Array();
  group: FormGroup;
  filterApplied: boolean = false;
  localsFiltered: Barbershops.Barbershop[];
  reservation: Reservations.Reservation;

  constructor(
    private navCtrl: NavController,
    private localsService: LocalsService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    await this.getLocals();
    this.buildForm();
  }

  async ionViewDidEnter() {
    await this.getLocals();
  }

  detalle(id: string) {
    this.navCtrl.navigateForward(`client/tabs/locals/${id}`);
  }

  async getLocals() {
    this.localsService
      .getLocals(await this.authService.getAccessToken())
      .subscribe(
        (result) => {
          this.locals = result.barbershops;
          console.log(this.locals);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getLogoURL(image) {
    if (image) {
      return imagesUrl.barbershopLogo + image;
    } else {
      return '../../../../../../assets/img/no-avatar.png';
    }
  }

  buildForm() {
    this.group = this.formBuilder.group({
      searchBar: '',
    });
  }

  searchLocals() {
    if (this.group.get('searchBar').value.toLocaleLowerCase() !== '') {
      console.log(this.group.get('searchBar').value.toLocaleLowerCase());
      this.localsFiltered = new Array();
      this.filterApplied = true;
      this.localsFiltered = this.locals.filter(
        (l) =>
          l.name
            .toLowerCase()
            .indexOf(this.group.get('searchBar').value.toLocaleLowerCase()) > -1
      );
      console.log(this.localsFiltered);
    } else {
      this.filterApplied = false;
      console.log(this.group.get('searchBar').value.toLocaleLowerCase());
    }
  }
}
