import { TestBed } from '@angular/core/testing';

import { BuildMonthService } from './build-month.service';

describe('BuildMonthService', () => {
  let service: BuildMonthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildMonthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
