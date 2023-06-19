import { NgModule } from '@angular/core';
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
@NgModule({
  declarations: [
    LoaderComponent,
    DatatableComponent,
    TableAggridComponent,
    ButtonCellRendererComponent,
    CustomPinnedRowRendererComponent,
    ProyectosComponent,
    ParametrosComponent,
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      preventDuplicates: false,
    }) ,
    FormsModule,
    GuiGridModule,
    AgGridModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers:[
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorInterceptor, multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true },
    AuthGuard,
    AgGridSpanishService,
    CookieService,
    ObrasService,
    ProyectosService,
    ParametrosService,
    UsuariosService,
    PassDataService
  ],
  exports : [
    LoaderComponent,
    DatatableComponent,
    TableAggridComponent,
    ButtonCellRendererComponent,
    CustomPinnedRowRendererComponent,
    ProyectosComponent,
    ParametrosComponent,
    UsuariosComponent
  ]
})
export class SharedModule { }
