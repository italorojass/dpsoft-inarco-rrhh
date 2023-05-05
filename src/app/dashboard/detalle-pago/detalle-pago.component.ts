import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.css']
})
export class DetallePagoComponent implements OnInit,AfterViewInit  {
  @ViewChild(DataTableDirective, { static: false })
   datatableElement: any;

  dtOptions: DataTables.Settings = {};
  totalPeriodoEdit : any;
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.editPagoForm.valueChanges.subscribe((values:any)=>{
       this.totalPeriodoEdit= ((values.sueldoLiquido /30) * values.diasPago).toFixed(2);
    })

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



dataExample = [
  {
    numero : 1,
    findemes : 'quincena',
    nombre : 'Prueba',
    numFicha : 1,
    rut : '1-9',
    especialidad : 'Maestro albañil',
    sueldoLiquido : 673705,
    diasPago : 30,
    valorHoraExtraLiq : 3164,
    totalPeriodo : '',
    horaExtraLunesSabado : '',
    totalHoraExtraLiquido : '',
    diferenciaSabado : '',
    diferenciaDomingos : '',
    totalBonos : '',
    asignaciones : '',
    ajustePositivo : '',
    totalGanado : '',
    anticipo : '',
    descuentosVarios : '',
    remuneracionPagar : '',
    finiquitoFinMes : '',
    liquidoAPagar : ''

  },
  {
    numero : 2,
    findemes : 'quincena',
    nombreCompleto : 'pepe',
    numeroFicha : 1,
    rut : '1-9',
    especialidad : 'Maestro albañil',
    sueldoLiquido : 673705,
    diasPago : 30,
    valorHoraExtraLiq : 3164,
    totalPeriodo : '',
    horaExtraLunesSabado : '',
    totalHoraExtraLiquido : '',
    diferenciaSabado : '',
    diferenciaDomingos : '',
    totalBonos : '',
    asignaciones : '',
    ajustePositivo : '',
    totalGanado : '',
    anticipo : '',
    descuentosVarios : '',
    remuneracionPagar : '',
    finiquitoFinMes : '',
    liquidoAPagar : ''

  }
  ,
  {
    numero : 3,
    findemes : 'quincena',
    nombreCompleto : 'ivan',
    numeroFicha : 1,
    rut : '1-9',
    especialidad : 'Maestro albañil',
    sueldoLiquido : 673705,
    diasPago : 30,
    valorHoraExtraLiq : 3164,
    totalPeriodo : '',
    horaExtraLunesSabado : '',
    totalHoraExtraLiquido : '',
    diferenciaSabado : '',
    diferenciaDomingos : '',
    totalBonos : '',
    asignaciones : '',
    ajustePositivo : '',
    totalGanado : '',
    anticipo : '',
    descuentosVarios : '',
    remuneracionPagar : '',
    finiquitoFinMes : '',
    liquidoAPagar : ''

  }
]

getTotalPeriodo(sueldoLiquido :any, diasPago :any=30){
  return (sueldoLiquido / 30)*diasPago;
}

getHoraExtraLegalLunesSabado(){
  //total h extras del mes de la opcion horas extras
}

getValorHoraExtraLiquido(valorHoraExtraLiquido : number, valorHoraExtraLS:number){
  return valorHoraExtraLiquido * valorHoraExtraLS;
}

getDiferenciaDomingos(){
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
}

constructor(private fb : FormBuilder) {}

editPagoForm = this.fb.group({
  rut : [''],
  especialidad : [''],
  numFicha : [''],
  nombre : [''],
  sueldoLiquido : [0,this.positiveVal()],
  diasPago : [''],
  valorHoraExtraLiquido : [''],
  totalPeriodo : [0],
  asignaciones : [''],
  ajustePositivo : [''],
  anticipo : [''],
  descuentosVarios : [''],
  finiquito : ['']
});

getNumberVal(val: string): number {
  val = `${val}`;
  return parseFloat(val.replace(/\u20AC/g, ''));
}

positiveVal(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const invalid = this.getNumberVal(control.value) <= 0;
        return invalid ? {'positiveVal': {value: control.value}} : null;
    };
  }


editPago(item : any){
  console.log(item);
  this.editPagoForm.patchValue(item);
}




}
