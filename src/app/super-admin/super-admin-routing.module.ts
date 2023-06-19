import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ProyectosComponent } from '../shared/components/proyectos/proyectos.component';
import { ParametrosComponent } from '../shared/components/parametros/parametros.component';
import { UsuariosComponent } from '../shared/components/usuarios/usuarios.component';
import { HomeComponent } from './home/home.component';
const routes: Routes = [{
  path : '',
  component : LayoutComponent,
  children : [
    {
      path :'',
      component : HomeComponent
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
  }]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
