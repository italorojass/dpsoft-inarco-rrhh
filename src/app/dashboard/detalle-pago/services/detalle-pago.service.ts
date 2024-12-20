import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetallePagoService {

  constructor(private _http: HttpClient) { }

  get(body:any){

    //console.log(`${environment.url}ws_estadopago_rrhh.php`,body);
    return this._http.post(`${environment.url}ws_estadopago_rrhh.php`,body);
  }

  cargaMasiva(body: any){
    return this._http.post(`${environment.url}ws_cargamasiva_rrhh.php`,body);
  }

  crearPDF(body){
    return this._http.post(`${environment.url}ws_eeppinforme_rrhh.php`,body);

  }
}
