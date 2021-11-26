import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonList,
  IonRouterOutlet,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Barbershops } from 'src/app/dtos/barbershops';
import { Comments } from 'src/app/dtos/comments';
import { AuthService } from 'src/app/services/auth.service';
import { LocalsService } from 'src/app/services/locals.service';
import { CommentsListComponent } from './comments-list/comments-list.component';
import { imagesUrl } from 'src/environments/environment.prod';
import { UsersService } from 'src/app/services/users.service';
import { Users } from 'src/app/dtos/users';

@Component({
  selector: 'app-local-details',
  templateUrl: './local-details.component.html',
  styleUrls: ['./local-details.component.scss'],
})
export class LocalDetailsComponent implements OnInit {
  barbershop: Barbershops.Barbershop;
  urlImage: string;
  showManageBooking: boolean = true;
  showGallery: boolean = false;
  comments: Comments.Comment[];
  commentsReady: boolean = false;
  @ViewChild('content', { read: IonContent }) content: IonContent;
  @ViewChild('commentsList', { read: CommentsListComponent })
  commentsList: CommentsListComponent;
  ratingNumber: number = 1;
  isFavourite: boolean = false;
  user: Users.User;
  localId: string;

  constructor(
    private route: ActivatedRoute,
    private localsService: LocalsService,
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  async ngOnInit() {}

  async ionViewDidEnter() {
    this.route.params.subscribe(async (params) => {
      this.localId = params['id'];
      this.localsService
        .getLocalDetails(await this.authService.getAccessToken(), this.localId)
        .subscribe(async (result) => {
          this.barbershop = result.barbershop;
          this.comments = this.barbershop.comments;
          this.commentsReady = true;
        });
      this.refreshComments(this.localId);
      this.usersService
        .getUserById(await this.authService.getAccessToken())
        .subscribe(
          (result) => {
            this.user = result.user;
            if (this.user.favourites)
              this.isFavourite = this.user.favourites.includes(this.localId);
            this.urlImage = `https://quiero-barber-api.herokuapp.com/api/v1/get-logo/${this.barbershop.logo}`;
          },
          (error) => {
            console.error(error);
          }
        );
    });
  }

  getLogoURL(image) {
    if (image) {
      return imagesUrl.barbershopLogo + image;
    } else {
      return '../../../../../../assets/img/no-avatar.png';
    }
  }

  segmentChanged(event) {
    if (event.detail.value === 'manage-booking') {
      this.showManageBooking = true;
      this.showGallery = false;
    } else {
      this.showManageBooking = false;
      this.showGallery = true;
    }
  }

  scrollToAddComment() {
    this.commentsList.scrollToAddComment();
  }

  handleFavourites() {
    if (!this.user.favourites) {
      this.user.favourites = [];
    }
    if (this.isFavourite) {
      let index = this.user.favourites.indexOf(this.barbershop._id);
      if (index > -1) {
        this.user.favourites.splice(index, 1);
      }
      this.isFavourite = false;
    } else {
      this.user.favourites = [...this.user.favourites, this.barbershop._id];
      this.isFavourite = true;
    }
    console.log(this.user.favourites);
    this.usersService.updateUserApi({ favourites: this.user.favourites });
  }

  async refreshComments(event: any) {
    this.commentsReady = false;
    this.localsService
      .getLocalDetails(await this.authService.getAccessToken(), this.localId)
      .subscribe((result) => {
        this.barbershop = result.barbershop;
        this.comments = this.barbershop.comments;
        this.commentsReady = true;
        this.urlImage = `https://quiero-barber-api.herokuapp.com/api/v1/get-logo/${this.barbershop.logo}`;
      });
  }
}
