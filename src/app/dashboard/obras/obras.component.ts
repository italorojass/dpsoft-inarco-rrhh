import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ObrasService } from './services/obras.service';
import { PeriodosService } from 'src/app/shared/services/periodos.service';

@Component({
  selector: 'app-obras',
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.css']
})
export class ObrasComponent implements OnInit {

  constructor(private router :Router, private ParametrosService : ParametrosService) { }

  obras:any = [];
  usuario : any;
  ngOnInit(): void {
    this.usuario = JSON.parse(sessionStorage.getItem('user')!);
    this.obras =  JSON.parse(sessionStorage.getItem('obras')!);

    this.ParametrosService.get({accion : 'C'}).subscribe((r: any) => {
      console.log('datos parametros', r);

      sessionStorage.setItem('datosParam',JSON.stringify(r.result.parametros[0]));
      sessionStorage.setItem('titlePage',r.result.parametros[0].quemes);

    });

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
