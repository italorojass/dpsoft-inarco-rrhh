import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNgSelectAggridComponent } from './select-ng-select-aggrid.component';

describe('SelectNgSelectAggridComponent', () => {
  let component: SelectNgSelectAggridComponent;
  let fixture: ComponentFixture<SelectNgSelectAggridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectNgSelectAggridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectNgSelectAggridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
