import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ObrasService } from './services/obras.service';
import { PeriodosService } from 'src/app/shared/services/periodos.service';
import { switchMap } from 'rxjs';
import { CentralizaPeriodosService } from 'src/app/shared/services/centraliza-periodos.service';

@Component({
  selector: 'app-obras',
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.css']
})
export class ObrasComponent implements OnInit {

  constructor(private router :Router, private ParametrosService : ParametrosService,
    private periodosSV : CentralizaPeriodosService

  ) { }

  title:string= '';

  obras:any = [];
  usuario : any;
  rolUser :string;
  periodos = [];

  ngOnInit(): void {
    this.usuario = JSON.parse(sessionStorage.getItem('user')!);
    this.obras =  JSON.parse(sessionStorage.getItem('obras')!);
    this.rolUser = sessionStorage.getItem('rolUser')!;

    this.title = 'Seleccionar Obra';

    this.getPeriodoActivo();

  }

  showObras : boolean;
  periodoActualAbierto;
  modelPeriodo;
  getPeriodoActivo(){
    this.periodos=[];
    this.periodosSV.getPeriodoActivo().pipe(

      switchMap((r:any)=>{
        this.periodoActualAbierto = r.result.parametros.filter(x=>x.estado=='A')[0];
        this.modelPeriodo= this.periodoActualAbierto;
        sessionStorage.setItem('periodoAbierto',JSON.stringify(this.periodoActualAbierto));
        sessionStorage.setItem('periodoAbiertoAUX',JSON.stringify(this.periodoActualAbierto));
       // this.periodos.push(this.periodoActualAbierto);

        return this.periodosSV.getPeriodosCerrados()
      })
    ).subscribe((r:any)=>{


      /* r.result.parametros.toReversed().map(x => {
        this.periodos.push(x);
      }); */
      this.periodos = Array.from(r.result.parametros).reverse();
     //this.periodos.reverse();

    })

  }

  selectPeriodo(periodo){

    this.showObras=true;
    sessionStorage.setItem('periodoAbierto',JSON.stringify(periodo));

  }

  go(i:any){

    sessionStorage.setItem('obraSelect',JSON.stringify(i))
    this.router.navigate(['/obras/inicio/detalle-pagos']);


  }

  rutaLogo = 'assets/images/logo-inarco-new-removebg-preview.jpg'
  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
