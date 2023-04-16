import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-obras',
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.css']
})
export class ObrasComponent implements OnInit {

  constructor() { }

  obras = [{
    id : 1,
    name : 'La dehesa 2'
  },
  {
    id : 2,
    name : 'Talbot'
  },
  {
    id : 3,
    name : 'Cd Bimbo'
  }
];
usuario : any;
  ngOnInit(): void {
    this.usuario = JSON.parse(sessionStorage.getItem('user')!).user

  }

  go(i:any){
    console.log('select',i);
    sessionStorage.setItem('obraSelect',JSON.stringify(i))

  }

}
