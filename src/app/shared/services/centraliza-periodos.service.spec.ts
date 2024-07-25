import { TestBed } from '@angular/core/testing';

import { CentralizaPeriodosService } from './centraliza-periodos.service';

describe('CentralizaPeriodosService', () => {
  let service: CentralizaPeriodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentralizaPeriodosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
