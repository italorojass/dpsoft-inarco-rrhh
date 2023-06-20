import { TestBed } from '@angular/core/testing';

import { HoraextraService } from './horaextra.service';

describe('HoraextraService', () => {
  let service: HoraextraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoraextraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
