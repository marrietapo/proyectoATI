import {  Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { UsersService } from './services/users.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';




@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private diagnostic: Diagnostic,
    private userService: UsersService,
    private splashScreen: SplashScreen
  ) {}
  ngOnInit(): void {
    this.splashScreen.show();
    this.statusBar.backgroundColorByHexString('#F77F00');
    this.platform.ready().then(()=>{
      this.splashScreen.hide();
    })

  }


}
