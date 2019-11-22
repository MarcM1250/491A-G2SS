import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  beforeEach( () => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule, RouterTestingModule],
    providers: [ AuthenticationService ]
  }));
  /*
  it(
    'should be initialized', 
    inject( [AuthenticationService], (service: AuthenticationService) => {
      expect(service).toBeTruthy();
  }));

  */

  it('should be created', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });
  
  it('should have getData function', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service.getUsers).toBeTruthy();
   });
   
});
