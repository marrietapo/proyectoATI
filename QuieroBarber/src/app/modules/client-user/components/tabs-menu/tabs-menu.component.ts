import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs-menu',
  templateUrl: './tabs-menu.component.html',
  styleUrls: ['./tabs-menu.component.scss'],
})
export class TabsMenuComponent implements OnInit {

  constructor(
    private statusBar: StatusBar,
    private platform:Platform
  ) { }

  ngOnInit() {
    this.statusBar.styleDefault();
  }

}
