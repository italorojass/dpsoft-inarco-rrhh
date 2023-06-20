import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  constructor(private _http: HttpClient) { }

  get(body){
    return this._http.post(`${environment.url}ws_especialidad_rrhh.php`,body);
  }
}
