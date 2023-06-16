import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAggridComponent } from './table-aggrid.component';

describe('TableAggridComponent', () => {
  let component: TableAggridComponent;
  let fixture: ComponentFixture<TableAggridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableAggridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableAggridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
