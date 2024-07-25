import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerAgGridComponent } from './datepicker-ag-grid.component';

describe('DatepickerAgGridComponent', () => {
  let component: DatepickerAgGridComponent;
  let fixture: ComponentFixture<DatepickerAgGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatepickerAgGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatepickerAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
