import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObrasComponent } from './obras/obras.component';
import { LayoutComponent } from './layout/layout.component';
import { DetallePagoComponent } from './detalle-pago/detalle-pago.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RequerimientosComponent } from './requerimientos/requerimientos.component';
import { ReporteComponent } from './reporte/reporte.component';

const routes: Routes = [
  {
    path : '',
    component : ObrasComponent
  },
  {
    path : 'inicio',
    component: LayoutComponent,
    children : [
      {
      path : '',
      component : DetallePagoComponent
    },
    {
      path : 'proyectos',
      component : ProyectosComponent
    },
    {
      path : 'usuarios',
      component : UsuariosComponent
    },
    {
      path : 'parametros',
      component : UsuariosComponent
    },
    {
      path : 'requerimientos',
      component : RequerimientosComponent
    },
    {
      path : 'reportes',
      component : ReporteComponent
    }
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
