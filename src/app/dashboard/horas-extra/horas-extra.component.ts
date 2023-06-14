import { Component, OnInit } from '@angular/core';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { HoraextraService } from './services/horaextra.service';
import { FormBuilder } from '@angular/forms';
import { ParametrosService } from '../parametros/services/parametros.service';

@Component({
  selector: 'app-horas-extra',
  templateUrl: './horas-extra.component.html',
  styleUrls: ['./horas-extra.component.css']
})
export class HorasExtraComponent implements OnInit {

  constructor(private dtSv: HoraextraService, private bt: BuildMonthService, private fb : FormBuilder,private paramSV : ParametrosService) { }

  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  totalSm : any=[];
  formDate = this.fb.group({
    inicio : [''],
    final : [''],
  })



  ngOnInit(): void {

    this.getPeriodo();
    this.getHoraExtra();
    if(this.formDate.valid){
      this.formDate.valueChanges.subscribe(values=>{
        console.log(values);
        let init = new Date(values.inicio);
        let final = new Date(values.final)
        if(final >= init ){
          this.buildHeader(values.inicio,values.final);
        }

      })
    }

  }

  getPeriodo(){
    let b = {
      accion : 'C',
      obra: this.obra.codigo
    }
    this.paramSV.get(b).subscribe(r=>{

      let res = r['result'].parametros[0];
      this.formDate.patchValue({
        inicio : res.inicio_periodo,
        final : res.final_periodo
      })
    })
  }
buildHeader(inicio,final){
  this.tblHeader=[];
  let weekday = this.bt.getDaysInMonth(inicio, final);

  console.log('weekday', weekday);
  let c=0;
  weekday.forEach((element,i) => {
    this.tblHeader.push(element)
    if(element.nombre == 'Domingo'){
      c++
      this.tblHeader.push({dia : c, nombre : `Total semana`});
      this.totalSm.push(element);
      //console.log('push total semana y count', element,c);
    }
  });
}

  tblHeader = [];
  data: any = [];
  getHoraExtra() {
    let body = {
      tipo: 'extras',
      obra: this.obra.codigo,
      accion: 'C'
    }
    this.dtSv.get(body).subscribe((r: any) => {
      //this.data = r.result.extras;
      console.log('data final',r)
      let b = {
        header : [],
        body : [],
        tothormes : '',
        totvalhor : '',
        valhor : ''
      };

    /*   for(var key in object){
        //console.log(key + ' - ' + object[key])
      } */
      this.data = r.result.extras.map((value) => {
        return {
          ...value,
          isEdit: false
        }
      });
      //console.log('data final',this.data)
    })
  }

  saveEdit(item){
    console.log('modificado',item);
      let body = {
      tipo: 'extras',
      obra: this.obra.codigo,
      accion: 'M',
      ...item
    }
    console.log('body edit',body);
    this.dtSv.get(body).subscribe((r: any) => {

      item.isEdit = false
      let reemplazar = this.data.findIndex(x=>x.id == r['result'].extras[0].id);
      this.data[reemplazar] = r['result'].extras[0];

    })
  }



}
