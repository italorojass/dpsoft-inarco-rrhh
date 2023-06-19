import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ObrasComponent } from './obras/obras.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DetallePagoComponent } from './detalle-pago/detalle-pago.component';
import { RequerimientosComponent } from './requerimientos/requerimientos.component';
import { ReporteComponent } from './reporte/reporte.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DiferenciaSabDomComponent } from './diferencia-sab-dom/diferencia-sab-dom.component';
import { DetalleBonoComponent } from './detalle-bono/detalle-bono.component';
import { NgChartsModule } from 'ng2-charts';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";
import { MaestroEspecialidadComponent } from './maestro-especialidad/maestro-especialidad.component';
import { HeaderInterceptor } from '../shared/interceptors/header.interceptor';
import { DetallePagoService } from './detalle-pago/services/detalle-pago.service';
import { BuildMonthService } from '../shared/services/build-month.service';
import { HoraextraService } from './horas-extra/services/horaextra.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import localeEs from '@angular/common/locales/es';
import { LoaderInterceptorInterceptor } from '../shared/interceptors/loader-interceptor.interceptor';
import { DifSabDomService } from './diferencia-sab-dom/services/dif-sab-dom.service';
import { BonosService } from './detalle-bono/services/bonos.service';
import { SharedModule } from '../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { HorasExtraComponent } from './horas-extra/horas-extra.component';

// Registra el idioma español
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    ObrasComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    DetallePagoComponent,
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
    NgChartsModule,
    HttpClientModule,
    DataTablesModule,
    SharedModule,
    FormsModule,
    NgbModule,
    SweetAlert2Module,
    AgGridModule
  ],
  providers : [

    {
      provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true
    },
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorInterceptor, multi: true
    },

    DetallePagoService,
    BuildMonthService,
    HoraextraService,
    DifSabDomService,
    BonosService
  ]
})
export class DashboardModule { }
