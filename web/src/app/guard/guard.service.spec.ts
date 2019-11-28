import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";

import { AuthenticationService } from 'src/app/services/authentication.service';
import { GuardService } from './guard.service';

describe('GuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    providers: [ { provide: AuthenticationService, useValue: ''} ]
  }));

  it('should be created', () => {
    const service: GuardService = TestBed.get(GuardService);
    expect(service).toBeTruthy();
  });
});
