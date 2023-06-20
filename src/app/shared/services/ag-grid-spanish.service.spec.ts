import { TestBed } from '@angular/core/testing';

import { AgGridSpanishService } from './ag-grid-spanish.service';

describe('AgGridSpanishService', () => {
  let service: AgGridSpanishService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgGridSpanishService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
