import { TestBed } from '@angular/core/testing';

import { EliminarPagoService } from './eliminar-pago.service';

describe('EliminarPagoService', () => {
  let service: EliminarPagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EliminarPagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
