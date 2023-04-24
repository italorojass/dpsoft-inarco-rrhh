import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-obras',
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.css']
})
export class ObrasComponent implements OnInit {

  constructor(private router :Router) { }

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
    this.usuario = JSON.parse(sessionStorage.getItem('user')!)

  }

  go(i:any){
    console.log('select',i);
    sessionStorage.setItem('obraSelect',JSON.stringify(i))

  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
