import { TestBed } from '@angular/core/testing';

import { FreezerService } from './freezer.service';

describe('FreezerService', () => {
  let service: FreezerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreezerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
