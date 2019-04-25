import { TestBed } from '@angular/core/testing';

import { UploadsService } from './uploads.service';

describe('UploadsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadsService = TestBed.get(UploadsService);
    expect(service).toBeTruthy();
  });
});
