import { TestBed } from '@angular/core/testing';

import { InputHeaderService } from './input-header.service';

describe('InputHeaderService', () => {
  let service: InputHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
