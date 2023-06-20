import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DifSabDomService {

  constructor(private _http: HttpClient) { }


  get(body:any){

    // console.log(`${environment.url}ws_horaextra_rrhh.php`,body);
     return this._http.post(`${environment.url}ws_sabdom_rrhh.php`,body);
   }
}
