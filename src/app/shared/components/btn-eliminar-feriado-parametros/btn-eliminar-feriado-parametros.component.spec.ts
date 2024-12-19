import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnEliminarFeriadoParametrosComponent } from './btn-eliminar-feriado-parametros.component';

describe('BtnEliminarFeriadoParametrosComponent', () => {
  let component: BtnEliminarFeriadoParametrosComponent;
  let fixture: ComponentFixture<BtnEliminarFeriadoParametrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnEliminarFeriadoParametrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnEliminarFeriadoParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
