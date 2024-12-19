import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  constructor(private _http: HttpClient) { }

  get(body:any){

    //console.log(`${environment.url}ws_estadopago_rrhh.php`,body);
    return this._http.post(`${environment.url}ws_parame_rrhh.php`,body);
  }

  postFeriadoObra(body:any){

    //console.log(`${environment.url}ws_estadopago_rrhh.php`,body);
    return this._http.post(`${environment.url}ws_feriadosano_rrhh.php`,body);
  }


  getFeriadosMonthYear(year,month){
    return this._http.get(`${ environment.apiFeriadosv}${year}/${month}`);
  }

  getFeriados(body){
    return this._http.post(`${ environment.url}ws_feriadosano_rrhh.php`,body);
  }

  updateSueldos(body){
    return this._http.post(`${environment.url}ws_calculo_sueldo_rrhh.php`,body);
  }

  getBonos(body){
    return this._http.post(`${environment.url}ws_nombrebonos_rrhh.php`,body);
  }

  cierre(body){
    return this._http.post(`${environment.url}ws_cierre_rrhh.php`,body);

  }

  getCalendarioHoraExtra(body){
    return this._http.post(`${environment.url}ws_parameobras_rrhh.php`,body);
  }


  getEstado(estado){
    return estado =='A' ? 'ABIERTO' : 'CERRADO'
  }

}
