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
import { NgChartsModule } from 'ng2-charts';
import { RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";
import { MaestroEspecialidadComponent } from './maestro-especialidad/maestro-especialidad.component';
import { SharedModule } from '../shared/shared.module';
import { UsuariosService } from './usuarios/services/usuarios.service';
import { HeaderInterceptor } from '../shared/interceptors/header.interceptor';
import { ObrasService } from './obras/services/obras.service';

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
    DetalleBonoComponent,
    MaestroEspecialidadComponent


  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    AgGridModule,
    NgChartsModule,
    RecaptchaModule,
    HttpClientModule,
    DataTablesModule,
    SharedModule

  ],
  providers : [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: "<YOUR_KEY>" } as RecaptchaSettings,
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true
    },
    UsuariosService,
    ObrasService
  ]
})
export class DashboardModule { }
