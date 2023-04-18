import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObrasComponent } from './obras/obras.component';
import { LayoutComponent } from './layout/layout.component';
import { DetallePagoComponent } from './detalle-pago/detalle-pago.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RequerimientosComponent } from './requerimientos/requerimientos.component';
import { ReporteComponent } from './reporte/reporte.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DiferenciaSabDomComponent } from './diferencia-sab-dom/diferencia-sab-dom.component';
import { DetalleBonoComponent } from './detalle-bono/detalle-bono.component';
import { HorasExtraComponent } from './horas-extra/horas-extra.component';
import { ParametrosComponent } from './parametros/parametros.component';

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
      component : DashboardComponent
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
      component : ParametrosComponent
    },
    {
      path : 'requerimientos',
      component : RequerimientosComponent
    },
    {
      path : 'reportes',
      component : ReporteComponent
    }
    ,
    {
      path : 'horas-extras',
      component : HorasExtraComponent
    },
    {
      path : 'detalle-pagos',
      component : DetallePagoComponent
    },
    {
      path : 'diferencia-sab-dom',
      component : DiferenciaSabDomComponent
    },
    {
      path : 'detalle-bonos',
      component : DetalleBonoComponent
    },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
