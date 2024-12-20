import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObrasComponent } from './obras/obras.component';
import { LayoutComponent } from './layout/layout.component';
import { DetallePagoComponent } from './detalle-pago/detalle-pago.component';
import { RequerimientosComponent } from './requerimientos/requerimientos.component';
import { ReporteComponent } from './reporte/reporte.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DiferenciaSabDomComponent } from './diferencia-sab-dom/diferencia-sab-dom.component';
import { DetalleBonoComponent } from './detalle-bono/detalle-bono.component';
import { HorasExtraComponent } from './horas-extra/horas-extra.component';
import { MaestroEspecialidadComponent } from './maestro-especialidad/maestro-especialidad.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { CalendarioHoraExtraComponent } from './calendario-hora-extra/calendario-hora-extra.component';
// ... existing imports ...
import { CalendarioFeriadosComponent } from './calendario-feriados/calendario-feriados.component';
// ... rest of the file ...

const routes: Routes = [
  {
    path : '',
    component : ObrasComponent,
    canActivate : [AuthGuard]
  },
  {
    path : 'inicio',
    component: LayoutComponent,
    canActivate : [AuthGuard],
    children : [
      {
      path : '',
      component : DashboardComponent

    },

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
    {
      path : 'calendario-hora-extra',
      component : CalendarioHoraExtraComponent
    },
    {
      path : 'calendario-feriados',
      component : CalendarioFeriadosComponent
    },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
