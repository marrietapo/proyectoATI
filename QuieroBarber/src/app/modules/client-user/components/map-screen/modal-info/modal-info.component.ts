import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Barbershops } from 'src/app/dtos/barbershops';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent implements OnInit {
  @Input() barbershop: Barbershops.Barbershop;

  constructor(private modalCtl: ModalController) {}

  ngOnInit() {}
}
