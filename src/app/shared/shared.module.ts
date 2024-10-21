import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptorInterceptor } from './interceptors/loader-interceptor.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridSpanishService } from './services/ag-grid-spanish.service';
import { DatatableComponent } from './components/datatable/datatable.component';
import { GuiGridModule } from '@generic-ui/ngx-grid';
import { TableAggridComponent } from './components/table-aggrid/table-aggrid.component';
import { AgGridModule } from 'ag-grid-angular';
import { ButtonCellRendererComponent } from './components/button-cell-renderer/button-cell-renderer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomPinnedRowRendererComponent } from './components/custom-pinned-row-renderer/custom-pinned-row-renderer.component';

import { CookieService } from 'ngx-cookie-service';
import { ObrasService } from '../dashboard/obras/services/obras.service';
import { ProyectosService } from './components/proyectos/services/proyectos.service';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { ParametrosComponent } from './components/parametros/parametros.component';
import { ParametrosService } from './components/parametros/services/parametros.service';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuariosService } from './components/usuarios/services/usuarios.service';
import { PassDataService } from './components/button-cell-renderer/services/pass-data.service';
import { ObraSelectService } from './services/obra-select.service';
import { BtnReporteExcelComponent } from './components/btn-reporte-excel/btn-reporte-excel.component';
import { InputHeaderComponent } from './components/table-aggrid/input-header/input-header.component';
import { InputHeaderService } from './components/table-aggrid/input-header/input-header.service';
import { BtnEliminarDetallePagoComponent } from './components/btn-eliminar-detalle-pago/btn-eliminar-detalle-pago.component';
import { EliminarPagoService } from './components/btn-eliminar-detalle-pago/service/eliminar-pago.service';
import { ReporteService } from '../dashboard/reporte/service/reporte.service';
import { PeriodosService } from './services/periodos.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatepickerAgGridComponent } from './components/datepicker-ag-grid/datepicker-ag-grid.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DatepickerAgGridFinalComponent } from './components/datepicker-ag-grid-final/datepicker-ag-grid-final.component';
import { CabeceraPagesComponent } from './components/cabecera-pages/cabecera-pages.component';
import { RouterModule } from '@angular/router';
import { CentralizaPeriodosService } from './services/centraliza-periodos.service';
import { SelectNgSelectAggridComponent } from './components/select-ng-select-aggrid/select-ng-select-aggrid.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { BtnFiniquitarComponent } from './components/btn-finiquitar/btn-finiquitar.component';

@NgModule({
  declarations: [
    LoaderComponent,
    DatatableComponent,
    TableAggridComponent,
    ButtonCellRendererComponent,
    CustomPinnedRowRendererComponent,
    ProyectosComponent,
    ParametrosComponent,
    UsuariosComponent,
    BtnReporteExcelComponent,
    InputHeaderComponent,
    BtnEliminarDetallePagoComponent,
    DatepickerAgGridComponent,
    DatepickerAgGridFinalComponent,
    CabeceraPagesComponent,
    SelectNgSelectAggridComponent,
    BtnFiniquitarComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      preventDuplicates: true,
      positionClass: 'toast-top-center',
      closeButton : true,
      progressBar : true
    }) ,
    FormsModule,
    GuiGridModule,
    AgGridModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    FlatpickrModule.forRoot(),
    RouterModule,
    NgxSpinnerModule.forRoot()

  ],
  providers:[

    { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true },
    AuthGuard,
    AgGridSpanishService,
    CookieService,
    ObrasService,
    ProyectosService,
    ParametrosService,
    UsuariosService,
    PassDataService,
    ObraSelectService,
    InputHeaderService,
    EliminarPagoService,
    ReporteService,
    PeriodosService,
    CentralizaPeriodosService
  ],
  exports : [
    LoaderComponent,
    DatatableComponent,
    TableAggridComponent,
    ButtonCellRendererComponent,
    CustomPinnedRowRendererComponent,
    ProyectosComponent,
    ParametrosComponent,
    UsuariosComponent,
    BtnReporteExcelComponent,
    InputHeaderComponent,
    BtnEliminarDetallePagoComponent,
    CabeceraPagesComponent,
    SelectNgSelectAggridComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
