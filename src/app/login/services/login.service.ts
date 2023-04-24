import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient) { }


  login(datos:any){
    console.log(`${environment.url}auth_rrhh.php`);
    let headers = new HttpHeaders();
headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this._http.post(`${environment.url}auth_rrhh.php`,{datos}, {headers});
  }
}
