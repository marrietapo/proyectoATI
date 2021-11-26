import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Comments } from 'src/app/dtos/comments';
import { Users } from 'src/app/dtos/users';
import { AuthService } from 'src/app/services/auth.service';
import { LocalsService } from 'src/app/services/locals.service';
import { UsersService } from 'src/app/services/users.service';
import { imagesUrl } from 'src/environments/environment.prod';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss'],
})
export class CommentsListComponent implements OnInit {
  @Input() comments: Comments.Comment[];
  @Input() barbershopId: string;
  @ViewChild('list', { read: ElementRef }) list: ElementRef;
  ratingNumber: number = 1;
  showBtn: boolean = false;
  group: FormGroup;
  user: Users.User;
  @Output() doComment = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private localsService: LocalsService,
    private authService: AuthService,
    private userService: UsersService
  ) {}

  async ngOnInit() {
    this.buildForm();
    this.user = await this.userService.getUserInfo();
  }

  async ionViewDidEnter() {
    this.user = await this.userService.getUserInfo();
  }

  scrollToAddComment() {
    var arr = this.list.nativeElement.children;
    let item = arr[1];
    item.scrollIntoView();
  }

  showButton(event) {
    this.showBtn = event.detail.value !== '';
  }

  buildForm() {
    this.group = this.formBuilder.group({
      starRating: 1,
      comment: '',
    });
  }

  async addComment() {
    var rate = this.group.get('starRating').value;
    var comment = this.group.get('comment').value;
    this.localsService
      .addLocalComment(
        await this.authService.getAccessToken(),
        this.user._id,
        comment,
        rate,
        this.barbershopId
      )
      .subscribe(
        (result) => {
          this.doComment.emit('success');
          console.log(result);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getUserAvatarURL(image: string){
    return imagesUrl.userAvatar + image;
  }
}
