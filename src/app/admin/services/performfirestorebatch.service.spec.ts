import { TestBed } from '@angular/core/testing';

import { PerformfirestorebatchService } from './performfirestorebatch.service';

describe('PerformfirestorebatchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerformfirestorebatchService = TestBed.get(PerformfirestorebatchService);
    expect(service).toBeTruthy();
  });
});
