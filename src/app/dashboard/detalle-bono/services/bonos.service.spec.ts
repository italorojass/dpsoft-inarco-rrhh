import { TestBed } from '@angular/core/testing';

import { BonosService } from './bonos.service';

describe('BonosService', () => {
  let service: BonosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
