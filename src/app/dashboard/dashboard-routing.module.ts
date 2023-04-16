import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObrasComponent } from './obras/obras.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path : '',
    component : ObrasComponent
  },
  {
    path : 'inicio',
    component: LayoutComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
