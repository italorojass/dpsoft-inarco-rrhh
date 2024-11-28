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

  getPeriodosCerrados(){
    return this.ParametrosService.get({accion : 'R'});


  }

  periodoSelect =new BehaviorSubject<any>(null);
  data$ = this.periodoSelect.asObservable();
  periodoSeleccionado : any;
  setPeriodoSeleccionado(periodoSeleccionado){
    this.periodoSeleccionado= periodoSeleccionado;

   // this.periodoSelect.next(periodoSeleccionado);
   //
  }


 buildBodyRequestComponents(tipo,accion){

    let periodoSession = JSON.parse(sessionStorage.getItem('periodoAbierto')!);

    let body = {
      tipo : tipo,
      accion: accion,
      obra:  JSON.parse(sessionStorage.getItem('obraSelect')!).codigo,
      quemes : '',
      abierto : ''
    }
    if(tipo== 'extras' ){
     delete body['tipo']
    }
   if(!periodoSession){
    let periodoAux = JSON.parse(sessionStorage.getItem('periodoAbiertoAUX')!);
    body = {
      ...body,
        quemes :periodoAux?.quemes,
        abierto : periodoAux?.estado
      }


   }else{
   body = {
      ...body,
      quemes :periodoSession.quemes ,
      abierto : periodoSession.estado
    }
   }

    console.log('body build',body);
    return body;
  }


  getPeriodoSeleccionado(){
    return this.periodoSelect.asObservable();
  }

  /* cleanPeriodoSelect(){
    this.periodoSelect = new BehaviorSubject<any>(null);
  } */
}
