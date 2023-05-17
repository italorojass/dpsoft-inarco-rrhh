import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { DetallePagoService } from './services/detalle-pago.service';

@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.css']
})
export class DetallePagoComponent implements OnInit,AfterViewInit  {
  //mostrar liquido a pagar
  //en  pop up finiquito fin de mes va a validar contra el sueldo liquido
  //el resto se calcula en base a remuneracion a pagar
  @ViewChild(DataTableDirective, { static: false })
   datatableElement: any;

  dtOptions: DataTables.Settings = {};
  totalPeriodoEdit : any;
  totalRemuneracionEdit : any;
  totalDesctEdit : any;
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.editPagoForm.valueChanges.subscribe((values:any)=>{
      console.log(values);
       this.totalPeriodoEdit= ((values.sueldo_liq /30) * values.dias).toFixed(2);
       this.totalRemuneracionEdit = (values.ajuste_pos + values.asignaciones);
       this.totalDesctEdit = (values.anticipo - values.dctos_varios);
       //remuneracion a pagar
       // total periodo + totalvalorhoraextraliquido+totalbonos+asignaciones+diferdom+ajustePos - los descuentos
    });

    this.getPagos();

  }

  data :any = [];

  getPagos(){
    let obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
    console.log(obra)
    let body = {
      tipo : 'pagos',
      obra : obra.codigo
    }
    this.dtSv.get(body).subscribe((r:any)=>{
        this.data = r.result.pagos;
        console.log(r.result)
    })
  }

  getTotalSueldoLiq(){
    let sueldo = 0;
    this.data.forEach((element:any)=>{
      sueldo += Number(element.sueldo_liq);

    });
    return sueldo;
  }

  getTotalValor_hora(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.valor_hora);

    });
    return result;
  }

  getTotaltotal_periodo(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.total_periodo);

    });
    return result;
  }


  getTotalhor_lun_sab(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.hor_lun_sab);

    });
    return result;
  }

  getTotalval_lun_sab(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.val_lun_sab);

    });
    return result;
  }


  getTotaldifer_sabado(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.difer_sabado);

    });
    return result;
  }

  getTotaldifer_domingo(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.difer_domingo);

    });
    return result;
  }

  getTotaltotal_bonos(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.total_bonos);

    });
    return result;
  }

  getTotalAsignaciones(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.asignaciones);

    });
    return result;
  }

  getTotalajuste_pos(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.ajuste_pos);

    });
    return result;
  }

  getTotaltotal_ganado(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.total_ganado);

    });
    return result;
  }

  getTotalanticipo(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.anticipo);

    });
    return result;
  }

  getTotaldctos_varios(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.dctos_varios);

    });
    return result;
  }

  getTotala_pagar(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.dctos_varios);

    });
    return result;
  }

  getTotalfiniquito(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.dctos_varios);

    });
    return result;
  }

  getTotalliq_apagar(){
    let result = 0;
    this.data.forEach((element:any)=>{
      result += Number(element.liq_apagar);

    });
    return result;
  }

  dictFicha : any = {
    F1 : 'badge-outline-primary',
    F2 : 'badge-outline-info2',
    F3 : 'badge-outline-warning2',
    F4 :  'badge-outline-info',
    F5 :  'badge-outline-danger2'
  }

  getBadgeFicha(ficha:any){
    return this.dictFicha[ficha];
  }

  ngAfterViewInit(): void {
   /*  this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().every(function () {
        const that = this;
        console.log('antes',this.header());
        $('input', this.header()).on('keyup change', function () {

          console.log('foot',this);
          if (that.search() !== this['value']) {

            that.search(this['value']).draw();
          }
        });
      });
    }); */
  }


getTotalPeriodo(sueldoLiquido :any, diasPago :any=30){
  return (sueldoLiquido / 30)*diasPago;
}

/* getHoraExtraLegalLunesSabado(){
  //total h extras del mes de la opcion horas extras
}
 */
/* getValorHoraExtraLiquido(valorHoraExtraLiquido : number, valorHoraExtraLS:number){
  return valorHoraExtraLiquido * valorHoraExtraLS;
}
 */
/* getDiferenciaDomingos(){
  //diferencia mensual domingo de la opcion diferencia sab. dom.
}

getTotalBonos(){
  //total bonos de opcion detalle bonos
}

getTotalGanado(){
  //suma de..
  //total periodo
  //Total valor hora extra líquido
  //Diferencia días sábados
  //Diferencia días domingos
  //Total bonos
  //Asignaciones
  //ajuste positivo
} */

constructor(private fb : FormBuilder, private dtSv : DetallePagoService) {}

editPagoForm = this.fb.group({
  rut : [''],
  especialidad : [''],
  ficha : [''],
  nombre : [''],
  sueldo_liq : [0],
  dias : [0],
  valor_hora : [0],
  totalPeriodo : [0],
  asignaciones : [0],
  ajuste_pos : [0],
  anticipo : [0],
  dctos_varios : [0],
  finiquito : [0]
});



editPago(item : any){
  console.log(item);
  this.editPagoForm.patchValue(item);
}




}
