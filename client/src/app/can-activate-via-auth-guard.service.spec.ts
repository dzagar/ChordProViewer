/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CanActivateViaAuthGuardService } from './can-activate-via-auth-guard.service';

describe('Service: CanActivateViaAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateViaAuthGuardService]
    });
  });

  it('should ...', inject([CanActivateViaAuthGuardService], (service: CanActivateViaAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
