import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ProyectosComponent } from '../shared/components/proyectos/proyectos.component';
import { ParametrosComponent } from '../shared/components/parametros/parametros.component';
import { UsuariosComponent } from '../shared/components/usuarios/usuarios.component';
import { HomeComponent } from './home/home.component';
import { ReporteComponent } from '../dashboard/reporte/reporte.component';
import { DashboardComponent } from './dashboard/dashboard.component';
const routes: Routes = [{
  path : '',
  component : LayoutComponent,
  data: {title: 'Inicio'},
  children : [
    {
      path :'',
     redirectTo : 'proyectos',
     pathMatch : 'full'

    },
    {
      path:'dashboard',
      component : DashboardComponent
    },
    {
    path:'proyectos',
    component : ProyectosComponent
  },
  {
    path:'usuarios',
    component : UsuariosComponent
  },
  {
    path:'parametros',
    component : ParametrosComponent
  },
  {
    path : 'reportes',
    component : ReporteComponent
  }]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
