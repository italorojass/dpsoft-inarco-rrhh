/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CalendarioFeriadosService } from './calendario-feriados.service';

describe('Service: CalendarioFeriados', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarioFeriadosService]
    });
  });

  it('should ...', inject([CalendarioFeriadosService], (service: CalendarioFeriadosService) => {
    expect(service).toBeTruthy();
  }));
});
