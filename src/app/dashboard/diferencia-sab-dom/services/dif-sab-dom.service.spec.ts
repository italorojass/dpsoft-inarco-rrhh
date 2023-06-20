import { TestBed } from '@angular/core/testing';

import { DifSabDomService } from './dif-sab-dom.service';

describe('DifSabDomService', () => {
  let service: DifSabDomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DifSabDomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
