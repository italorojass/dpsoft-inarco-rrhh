import { TestBed } from '@angular/core/testing';

import { DetallePagoService } from './detalle-pago.service';

describe('DetallePagoService', () => {
  let service: DetallePagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetallePagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
