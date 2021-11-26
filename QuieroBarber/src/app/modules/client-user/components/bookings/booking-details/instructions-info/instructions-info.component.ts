import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Barbershops } from 'src/app/dtos/barbershops';


@Component({
  selector: 'app-instructions-info',
  templateUrl: './instructions-info.component.html',
  styleUrls: ['./instructions-info.component.scss'],
})
export class InstructionsInfoComponent implements OnInit {
  @Input() barbershop: Barbershops.Barbershop;

  constructor(private modalCtr: ModalController) {}

  ngOnInit() {}

  showInstructions() {

  }

  goBack() {
    this.modalCtr.dismiss();
  }
}
