import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnReporteExcelComponent } from './btn-reporte-excel.component';

describe('BtnReporteExcelComponent', () => {
  let component: BtnReporteExcelComponent;
  let fixture: ComponentFixture<BtnReporteExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnReporteExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnReporteExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
