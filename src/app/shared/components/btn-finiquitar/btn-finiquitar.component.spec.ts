import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnFiniquitarComponent } from './btn-finiquitar.component';

describe('BtnFiniquitarComponent', () => {
  let component: BtnFiniquitarComponent;
  let fixture: ComponentFixture<BtnFiniquitarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnFiniquitarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnFiniquitarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
