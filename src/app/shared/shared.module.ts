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
import { FormsModule } from '@angular/forms';
import { AgGridSpanishService } from './services/ag-grid-spanish.service';
import { DatatableComponent } from './components/datatable/datatable.component';
import { GuiGridModule } from '@generic-ui/ngx-grid';
import { TableAggridComponent } from './components/table-aggrid/table-aggrid.component';
import { AgGridModule } from 'ag-grid-angular';
import { ButtonCellRendererComponent } from './components/button-cell-renderer/button-cell-renderer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    LoaderComponent,
    DatatableComponent,
    TableAggridComponent,
    ButtonCellRendererComponent
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
    NgbModule
  ],
  providers:[
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorInterceptor, multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true },
    AuthGuard,
    AgGridSpanishService
  ],
  exports : [
    LoaderComponent,
    DatatableComponent,
    TableAggridComponent,
    ButtonCellRendererComponent
  ]
})
export class SharedModule { }
