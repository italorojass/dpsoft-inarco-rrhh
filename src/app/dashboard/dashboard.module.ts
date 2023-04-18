import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ObrasComponent } from './obras/obras.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DetallePagoComponent } from './detalle-pago/detalle-pago.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { RequerimientosComponent } from './requerimientos/requerimientos.component';
import { ReporteComponent } from './reporte/reporte.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HorasExtraComponent } from './horas-extra/horas-extra.component';
import { DiferenciaSabDomComponent } from './diferencia-sab-dom/diferencia-sab-dom.component';
import { DetalleBonoComponent } from './detalle-bono/detalle-bono.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    ObrasComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    DetallePagoComponent,
    ProyectosComponent,
    UsuariosComponent,
    ParametrosComponent,
    RequerimientosComponent,
    ReporteComponent,
    DashboardComponent,
    HorasExtraComponent,
    DiferenciaSabDomComponent,
    DetalleBonoComponent


  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    AgGridModule,
    RouterModule
  ]
})
export class DashboardModule { }
