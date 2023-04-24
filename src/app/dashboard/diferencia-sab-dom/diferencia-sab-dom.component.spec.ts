import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiferenciaSabDomComponent } from './diferencia-sab-dom.component';

describe('DiferenciaSabDomComponent', () => {
  let component: DiferenciaSabDomComponent;
  let fixture: ComponentFixture<DiferenciaSabDomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiferenciaSabDomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiferenciaSabDomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
