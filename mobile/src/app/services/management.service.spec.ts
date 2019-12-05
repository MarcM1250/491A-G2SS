import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ManagementService } from './management.service';
import { AuthenticationService } from './authentication.service';

describe('ManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ { provide: AuthenticationService, useValue: ''} ]
  }));
  
  it('should be created', () => {
    const service: ManagementService = TestBed.get(ManagementService);
    expect(service).toBeTruthy();
  });
});
