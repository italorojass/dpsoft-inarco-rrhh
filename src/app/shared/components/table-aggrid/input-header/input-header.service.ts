import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputHeaderService {

  constructor() { }

  obra = JSON.parse(sessionStorage.getItem('obraSelect'));
  bod =  {
    accion : 'M',
    obra : this.obra.codigo,
    nombre1 : '',
    nombre2 : '',
    nombre3 : '',
    nombre4 : '',
    nombre5 : '',
    nombre6 : '',
    nombre7 : '',
    nombre8 : '',
    nombre9 : '',
    nombre10 : '',
  };
}
