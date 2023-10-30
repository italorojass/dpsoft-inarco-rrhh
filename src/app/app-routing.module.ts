import { SuperAdminModule } from './super-admin/super-admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [{
  path : '',
  redirectTo : '/login',
  pathMatch : 'full'
},
{
  path : 'login',
  component : LoginComponent
},
{
  path : 'obras',
  loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
},
{
  path : 'admin',
  loadChildren: () => import('./super-admin/super-admin.module').then(m => m.SuperAdminModule)
},
{  path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true , onSameUrlNavigation: 'reload' })],

  exports: [RouterModule],

})
export class AppRoutingModule { }
