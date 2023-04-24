import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
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
    nombreCompleto : 'Prueba',
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



constructor() {}




}
