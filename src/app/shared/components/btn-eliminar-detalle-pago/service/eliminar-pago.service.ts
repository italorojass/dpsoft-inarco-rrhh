import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EliminarPagoService {

  constructor(private HttpClient : HttpClient) { }
  dataEdit = new Subject()
  deleteTrabajador(body){
    return this.HttpClient.post(`${environment.url}ws_estadopago_rrhh.php`,body);
  }
}
