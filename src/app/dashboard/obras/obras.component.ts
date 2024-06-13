import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ObrasService } from './services/obras.service';
import { PeriodosService } from 'src/app/shared/services/periodos.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-obras',
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.css']
})
export class ObrasComponent implements OnInit {

  constructor(private router :Router, private ParametrosService : ParametrosService) { }

  obras:any = [];
  usuario : any;
  rolUser :string;

  ngOnInit(): void {
    this.usuario = JSON.parse(sessionStorage.getItem('user')!);
    this.obras =  JSON.parse(sessionStorage.getItem('obras')!);
    this.rolUser = sessionStorage.getItem('rolUser')!;
    //sessionStorage.removeItem('periodoAbierto')


  }



  go(i:any){
    //
    //this.router.navigate(['/inicio/detalle-pagos']);
    sessionStorage.setItem('obraSelect',JSON.stringify(i))

  }

  rutaLogo = 'assets/images/logo-inarco-new-removebg-preview.jpg'


  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
