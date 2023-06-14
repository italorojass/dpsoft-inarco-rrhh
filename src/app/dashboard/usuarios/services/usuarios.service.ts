import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private _http: HttpClient) { }

  /* get(){
    return this._http.post(`${environment.url}usuarios_rrhh.php`,'');
  } */

  crearEditUsuario(body:any){
    return this._http.post(`${environment.url}ws_usuario_rrhh.php`,body);
  }

}
