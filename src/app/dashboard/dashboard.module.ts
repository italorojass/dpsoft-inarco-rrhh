import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';

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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { DetallePagoService } from './detalle-pago/services/detalle-pago.service';
import { BuildMonthService } from '../shared/services/build-month.service';
import { HoraextraService } from './horas-extra/services/horaextra.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProyectosService } from './proyectos/services/proyectos.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import localeEs from '@angular/common/locales/es';
import { LoaderInterceptorInterceptor } from '../shared/interceptors/loader-interceptor.interceptor';
import { ParametrosService } from './parametros/services/parametros.service';
import { DifSabDomService } from './diferencia-sab-dom/services/dif-sab-dom.service';
import { BonosService } from './detalle-bono/services/bonos.service';
// Registra el idioma español
registerLocaleData(localeEs);

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
    SharedModule,
    FormsModule,
    NgbModule,
    SweetAlert2Module


  ],
  providers : [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: "<YOUR_KEY>" } as RecaptchaSettings,
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true
    },
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorInterceptor, multi: true
    },
    UsuariosService,
    ObrasService,
    DetallePagoService,
    BuildMonthService,
    HoraextraService,
    ProyectosService,
    ParametrosService,
    DifSabDomService,
    BonosService
  ]
})
export class DashboardModule { }
