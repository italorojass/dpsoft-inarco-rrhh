import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObrasService {

  constructor(private _http: HttpClient) { }

  /* get(){


    return this._http.post(`${environment.url}obras_rrhh.php`,'');
  } */

  getb(body){


    return this._http.post(`${environment.url}obras_rrhh.php`,body);
  }
}
