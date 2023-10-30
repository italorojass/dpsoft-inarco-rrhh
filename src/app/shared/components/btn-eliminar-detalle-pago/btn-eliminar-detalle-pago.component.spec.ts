import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnEliminarDetallePagoComponent } from './btn-eliminar-detalle-pago.component';

describe('BtnEliminarDetallePagoComponent', () => {
  let component: BtnEliminarDetallePagoComponent;
  let fixture: ComponentFixture<BtnEliminarDetallePagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnEliminarDetallePagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnEliminarDetallePagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
