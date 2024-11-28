import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioHoraExtraComponent } from './calendario-hora-extra.component';

describe('CalendarioHoraExtraComponent', () => {
  let component: CalendarioHoraExtraComponent;
  let fixture: ComponentFixture<CalendarioHoraExtraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarioHoraExtraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioHoraExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
