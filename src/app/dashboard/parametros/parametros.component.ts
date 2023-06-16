import { ToastrService } from 'ngx-toastr';
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

  constructor(private fb : FormBuilder, private bt : BuildMonthService, private paramSV : ParametrosService, private ToastrService : ToastrService) { }
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
  bonos= [];
  get(){
    let b = {
      accion : 'C',
      obra: this.obra.codigo
    }
    this.paramSV.get(b).subscribe(r=>{
      console.log(r);
      let res = r['result'].parametros[0];
      console.log('response parametros',res);
      this.bonos = r['result'].bonos;
      this.formDate.patchValue({
        inicio : res.inicio_periodo,
        final : res.final_periodo,
        cantDias : res.numero_dias,
        primerDia : res.primer_dia,
      })
    })
  }

  guardarBono(){
    if(this.bonos.length < 10){
      this.bonos.push({
        descripcion : this.formDate.value.nombre_bono
      });
      this.formDate.controls['nombre_bono'].reset();
    }else{
      this.ToastrService.warning('La cantidad máxima de bonos son 10','Máxima cantidad de bonos agregados')
    }

  }

  deleteBono(i){
    this.bonos.splice(i,1);
  }




}

