import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Barbershops } from 'src/app/dtos/barbershops';
import { Users } from 'src/app/dtos/users';
import { AuthService } from 'src/app/services/auth.service';
import { LocalsService } from 'src/app/services/locals.service';
import { UsersService } from 'src/app/services/users.service';
import { imagesUrl } from 'src/environments/environment.prod';

@Component({
  selector: 'app-favourites-list',
  templateUrl: './favourites-list.component.html',
  styleUrls: ['./favourites-list.component.scss'],
})
export class FavouritesListComponent implements OnInit {
  locals: Barbershops.Barbershop[] = new Array();
  group: FormGroup;
  filterApplied: boolean = false;
  localsFiltered: Barbershops.Barbershop[];
  user: Users.User;
  loading: boolean = true;

  constructor(
    private navCtrl: NavController,
    private localsService: LocalsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private usersService: UsersService
  ) {}

  async ngOnInit() {
    this.loading = false;
    this.usersService
      .getUserById(await this.authService.getAccessToken())
      .subscribe(
        (result) => {
          this.user = result.user;
        },
        (error) => {
          console.error(error);
        }
      );

    await this.getLocals();
    this.buildForm();
  }

  async ionViewDidEnter() {
    this.loading = true;
    this.usersService
      .getUserById(await this.authService.getAccessToken())
      .subscribe(
        (result) => {
          this.user = result.user;
        },
        (error) => {
          console.error(error);
        }
      );
    await this.getLocals();
  }
  /*async detalle(id: string) {
    const modal = await this.modalCtrl.create({
      component: LocalDetailsComponent,
      componentProps: {
        id,
      },
    });

    modal.present();
  }*/

  detalle(id: string) {
    this.navCtrl.navigateForward(`client/tabs/locals/${id}`);
  }

  async getLocals() {
    this.localsService
      .getLocals(await this.authService.getAccessToken())
      .subscribe(
        (result) => {
          this.locals = result.barbershops.filter((b) =>
            this.user.favourites.includes(b._id)
          );
          this.loading = false;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getLogoURL(image) {
    return imagesUrl.barbershopLogo + image;
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
    } else {
      this.filterApplied = false;
      console.log(this.group.get('searchBar').value.toLocaleLowerCase());
    }
  }
}
