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

    return this._http.post(`${environment.url}auth_rrhh.php`,datos);
  }

  isLogged(){
    return sessionStorage.getItem('user');
  }
}
