import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerAgGridFinalComponent } from './datepicker-ag-grid-final.component';

describe('DatepickerAgGridFinalComponent', () => {
  let component: DatepickerAgGridFinalComponent;
  let fixture: ComponentFixture<DatepickerAgGridFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatepickerAgGridFinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatepickerAgGridFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
