import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';

@Injectable({
  providedIn: 'root'
})
export class CentralizaPeriodosService {

  constructor(private ParametrosService : ParametrosService) { }

  obraActiva : any;
  setObraActiva(obra){
    this.obraActiva = obra;
  }
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  getPeriodoActivo(){
   return this.ParametrosService.get({accion : 'P'})/* .subscribe((r:any)=>{
       sessionStorage.setItem('periodoAbierto',JSON.stringify(r.result.parametros.filter(x=>x.estado =='A')[0]))

     }) */
  }

  periodoSelect =new BehaviorSubject<any>(null);
  data$ = this.periodoSelect.asObservable();
  periodoSeleccionado : any;
  setPeriodoSeleccionado(periodoSeleccionado){
    this.periodoSeleccionado= periodoSeleccionado;
    sessionStorage.setItem('periodoAbierto',JSON.stringify(periodoSeleccionado))
    this.periodoSelect.next(periodoSeleccionado);
   //
  }

  buildBodyRequestComponents(tipo,accion){

    let periodoSession = JSON.parse(sessionStorage.getItem('periodoAbierto'));
   // this.periodoSelect.next(periodoSession);
   /*  switch(tipo){
      case 'pagos':
        body = {
          accion: accion
        }
      break;
      case 'extras':
        body= { tipo: tipo
         }
      break;
       case 'finde':
        body = {
          tipo: tipo,
        }
      break;
      case 'bonos':
        body = {
          tipo: tipo,
        }
      break;
    } */

    return { tipo : tipo,
      accion: accion,
      obra: this.obra.codigo,
      quemes :periodoSession.quemes,
      abierto : periodoSession.estado}
  }


  getPeriodoSeleccionado(){
    return this.periodoSelect.asObservable();
  }

  /* cleanPeriodoSelect(){
    this.periodoSelect = new BehaviorSubject<any>(null);
  } */
}
