import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { ParametrosService } from './services/parametros.service';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  nombreDias = ['Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo'];

  constructor(private fb : FormBuilder, private bt : BuildMonthService, private paramSV : ParametrosService) { }
  formDate = this.fb.group({
    inicio : [''],
    final : [''],
    quincena : [],
    finmes : [],
    cantDias : [],
    primerDia : [],
    nombre_bono : ['']
  })
  daysTable:any=[];
  ngOnInit(): void {
    this.get();
  }

  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);

  get(){
    let b = {
      accion : 'C',
      obra: this.obra.codigo
    }
    this.paramSV.get(b).subscribe(r=>{
      console.log(r);
      let res = r['result'].parametros[0];
      console.log('response parametros',res);
      r['result'].parametros.map(x=>{
        console.log('new map',x);
      })
      this.formDate.patchValue({
        inicio : res.inicio_periodo,
        final : res.final_periodo,
        cantDias : res.numero_dias,
        primerDia : res.primer_dia,
      })
    })
  }




}

