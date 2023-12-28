import { Injectable } from '@angular/core';
import { Subject, map, tap } from 'rxjs';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodosService {

  constructor(private ParametrosService : ParametrosService) { }
  datosParametros;
  titlepage;
  getParametros(){

    /* return this.ParametrosService.get({ accion: 'C' }).pipe(
      map((x:any)=>{
        let body = {
          datosParams : x.result.parametros[0],
          title : x.result.parametros[0].quemes
         }

         return body;
      })
    ) */

    return this.ParametrosService.get({ accion: 'C' });
  }

  getTitlePage(){
    return this.titlepage;
  }

  getDatosParametros(){
    return this.datosParametros;
  }

}
