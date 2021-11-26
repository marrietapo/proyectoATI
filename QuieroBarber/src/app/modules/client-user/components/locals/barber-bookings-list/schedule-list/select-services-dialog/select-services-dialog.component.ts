import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController, PopoverController } from '@ionic/angular';
import { Reservations } from 'src/app/dtos/reservations';
import { Services } from 'src/app/dtos/services';
import { AuthService } from 'src/app/services/auth.service';
import { LocalsService } from 'src/app/services/locals.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { ResponseMessageComponent } from './response-message/response-message.component';

@Component({
  selector: 'app-select-services-dialog',
  templateUrl: './select-services-dialog.component.html',
  styleUrls: ['./select-services-dialog.component.scss'],
})
export class SelectServicesDialogComponent implements OnInit {
  @Input() scheduleHour: Reservations.ScheduleHour;
  @Input() barberId: string;
  @Input() barbershopId: string;
  group: FormGroup;
  services: Services.Service[] = new Array();
  servicesForm: FormArray;
  totalAmount: number;
  totalAmountDisplay: number;

  constructor(
    private localsService: LocalsService,
    private authService: AuthService,
    private reservationService: ReservationService,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private popoverController: PopoverController
  ) {}

  async ngOnInit() {
    this.totalAmount = 0;
    this.totalAmountDisplay = 0;
    this.group = this.formBuilder.group({});
    this.group.addControl('servicesForm', this.formBuilder.array([]));
    this.localsService
      .getLocalServices(
        await this.authService.getAccessToken(),
        this.barbershopId
      )
      .subscribe(
        (result) => {
          this.services = result.services;
          this.services.forEach((s) => {
            this.addServiceForm(s);
          });
        },
        (error) => {
          console.error(error);
        }
      );
  }

  ionViewDidEnter() {}

  async createReservation() {
    var servicesIds = new Array();

    var formArray = this.group.get('servicesForm')['controls'];
    for (var i = 0; i < formArray.length; i++) {
      if (formArray[i].get('isChecked').value) {
        servicesIds.push(formArray[i].get('serviceId').value);
        this.totalAmount += formArray[i].get('servicePrice').value;
      }
    }

    this.reservationService
      .createReservation(
        await this.authService.getAccessToken(),
        this.scheduleHour.date,
        servicesIds,
        this.barberId,
        this.barbershopId,
        this.scheduleHour.slot,
        this.totalAmount
      )
      .subscribe(
        (result) => {
          console.log(result);
          this.presentBarberPopover(true);
        },
        (error) => {
          console.error(error);
        }
      );

    //this.modalCtrl.dismiss();
  }

  async presentBarberPopover(success:boolean) {
    const popover = await this.popoverController.create({
      component: ResponseMessageComponent,
      componentProps: { success },
      cssClass: 'my-custom-class',
      translucent: true,
    });
    await popover.present();
    await setTimeout(function () {
      popover.dismiss();
    }, 1500);

    popover.onDidDismiss().then(() => {
      this.regresar();
    });
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

  createService(service: Services.Service): FormGroup {
    return this.formBuilder.group({
      isChecked: false,
      serviceId: service._id,
      servicePrice: service.price,
    });
  }

  getPriceValue(event, price: number) {
    console.log(price);
    event.detail.checked
      ? (this.totalAmountDisplay += price)
      : (this.totalAmountDisplay -= price);
  }

  addServiceForm(service: Services.Service): void {
    this.servicesForm = this.group.get('servicesForm') as FormArray;
    this.servicesForm.push(this.createService(service));
  }
}
