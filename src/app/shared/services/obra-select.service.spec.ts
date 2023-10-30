import { TestBed } from '@angular/core/testing';

import { ObraSelectService } from './obra-select.service';

describe('ObraSelectService', () => {
  let service: ObraSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObraSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
