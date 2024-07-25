import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabeceraPagesComponent } from './cabecera-pages.component';

describe('CabeceraPagesComponent', () => {
  let component: CabeceraPagesComponent;
  let fixture: ComponentFixture<CabeceraPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CabeceraPagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabeceraPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
