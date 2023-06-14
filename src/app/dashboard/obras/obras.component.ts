import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ObrasService } from './services/obras.service';

@Component({
  selector: 'app-obras',
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.css']
})
export class ObrasComponent implements OnInit {

  constructor(private router :Router, private obrasSv : ObrasService) { }

  obras:any = [];
  usuario : any;
  ngOnInit(): void {
    this.usuario = JSON.parse(sessionStorage.getItem('user')!)
    this.obras =  JSON.parse(sessionStorage.getItem('obras')!)
   /*  this.obrasSv.get().subscribe((r:any)=>{
      console.log(r);
      this.obras = r.result.obras;
      sessionStorage.setItem('obras',JSON.stringify(r.result.obras));
    }) */
  }

  go(i:any){
    console.log('select',i);
    sessionStorage.setItem('obraSelect',JSON.stringify(i))

  }

  rutaLogo = 'assets/images/logo-inarco-new-removebg-preview.jpg'


  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
