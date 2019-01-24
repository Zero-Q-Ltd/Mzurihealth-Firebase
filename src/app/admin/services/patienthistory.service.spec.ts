import { TestBed } from '@angular/core/testing';

import { PatienthistoryService } from './patienthistory.service';

describe('PatienthistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PatienthistoryService = TestBed.get(PatienthistoryService);
    expect(service).toBeTruthy();
  });
});
