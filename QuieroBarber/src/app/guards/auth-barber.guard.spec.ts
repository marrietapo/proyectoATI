import { TestBed } from '@angular/core/testing';

import { AuthBarberGuard } from './auth-barber.guard';

describe('AuthBarberGuard', () => {
  let guard: AuthBarberGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthBarberGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
