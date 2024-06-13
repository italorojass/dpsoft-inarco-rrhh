import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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

  periodoSelect = new Subject<any>();
  periodoSeleccionado : any;
  setPeriodoSeleccionado(periodoSeleccionado){
    this.periodoSeleccionado= periodoSeleccionado;
    sessionStorage.setItem('periodoAbierto',JSON.stringify(periodoSeleccionado))
    this.periodoSelect.next(periodoSeleccionado);
  }

  buildBodyRequestComponents(tipo,queMes,accion){
    let body = {
      tipo: tipo,
      accion: accion,
      obra: this.obra.codigo,
      quemes : queMes
    }

    return body
  }


  getPeriodoSeleccionado(){
    return this.periodoSelect.asObservable();
  }

  cleanPeriodoSelect(){
    this.periodoSelect = new Subject<any>();
  }
}
