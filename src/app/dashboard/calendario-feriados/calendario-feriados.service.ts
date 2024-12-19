import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarioFeriadosService {

constructor(private _http: HttpClient) { }

getb(body){
  return this._http.post(`${environment.url}ws_feriados_rrhh.php`,body);
}

getNombresFeriados(body){
  return this._http.post(`${environment.url}ws_nombreferiados_rrhh.php`,body);
}

}
