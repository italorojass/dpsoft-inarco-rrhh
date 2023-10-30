import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObraSelectService {

  constructor() { }

  get(){
    return JSON.parse(sessionStorage.getItem('obras'));
  }

  getSelected(){
    return JSON.parse(sessionStorage.getItem('obraSelect'));
  }

  ObraSelect
  set(obras){
    this.ObraSelect = obras;
   /*  sessionStorage.removeItem('obras');
    sessionStorage.setItem('obras',JSON.stringify(obras)); */
    return obras;
  }
}
