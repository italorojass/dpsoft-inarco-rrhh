import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioFeriadosComponent } from './calendario-feriados.component';

describe('CalendarioFeriadosComponent', () => {
  let component: CalendarioFeriadosComponent;
  let fixture: ComponentFixture<CalendarioFeriadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarioFeriadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioFeriadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
