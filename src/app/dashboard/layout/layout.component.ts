import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor() { }
  obra : string= '';

  ngOnInit(): void {
    this.obra = JSON.parse(sessionStorage.getItem('obraSelect')!).nombre;
  }

}
