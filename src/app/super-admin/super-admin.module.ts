import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { HeaderSaComponent } from './header-sa/header-sa.component';
import { LayoutComponent } from './layout/layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AgGridModule } from 'ag-grid-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderInterceptorInterceptor } from '../shared/interceptors/loader-interceptor.interceptor';
import { SharedModule } from '../shared/shared.module';
import { HeaderInterceptor } from '../shared/interceptors/header.interceptor';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    HeaderSaComponent,
    LayoutComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    FormsModule,
    NgbModule,
    SweetAlert2Module,
    AgGridModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule

  ],
  providers : [
    {
      provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorInterceptor, multi: true
    },
  ]
})
export class SuperAdminModule { }
