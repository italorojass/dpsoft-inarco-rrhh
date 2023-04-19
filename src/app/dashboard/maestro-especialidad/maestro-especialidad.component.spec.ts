import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroEspecialidadComponent } from './maestro-especialidad.component';

describe('MaestroEspecialidadComponent', () => {
  let component: MaestroEspecialidadComponent;
  let fixture: ComponentFixture<MaestroEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaestroEspecialidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestroEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
