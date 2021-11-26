import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NextBookingNotConnectionPopoverComponent } from './next-booking-not-connection-popover.component';

describe('NextBookingNotConnectionPopoverComponent', () => {
  let component: NextBookingNotConnectionPopoverComponent;
  let fixture: ComponentFixture<NextBookingNotConnectionPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NextBookingNotConnectionPopoverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NextBookingNotConnectionPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
