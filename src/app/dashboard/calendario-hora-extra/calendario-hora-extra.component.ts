import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AgGridAngular } from 'ag-grid-angular';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es'; // Importa el idioma español
@Component({
  selector: 'app-calendario-hora-extra',
  templateUrl: './calendario-hora-extra.component.html',
  styleUrls: ['./calendario-hora-extra.component.css']
})
export class CalendarioHoraExtraComponent implements OnInit , AfterViewInit {
  constructor(private fb : FormBuilder,
    private paramSV : ParametrosService,
    private ToastrService : ToastrService,
    private aggsv: AgGridSpanishService) {

      this.calendarForm = this.fb.group({
        dateRange: ['']
      });
    }
    formDate = this.fb.group({
      inicio : [''],
      final : [''],
      quincena : [],
      finmes : [],
      cantDias : [],
      primerDia : [],
      nombre_bono : ['']
    })
    nombreDias = ['Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo'];
    quemesViene : any;
    obra = JSON.parse(sessionStorage.getItem('obraSelect')!);

    calendarForm: FormGroup;
    dateRange: any;
    ngOnInit(): void {

      this.quemesViene = JSON.parse(sessionStorage.getItem('periodoAbierto'));

     // this.get();
    }

    startDate :any;
    endDate :any;
    ngAfterViewInit(): void {
      // Configura Flatpickr para seleccionar un rango de fechas
      console.log('value init dia', this.selectedInitDate )

      let b = {
        accion : 'C',
        obra :this.obra.codigo,
        mesyano : this.quemesViene.quemes,
        tipo_proceso : this.quemesViene.tipo_proceso
      }
      this.paramSV.getCalendarioHoraExtra(b).subscribe((r:any)=>{
        console.log(r);

        this.paramss =r.result.parametros[0];
        this.selectedInitDate = this.paramss.inicio_periodo
        this.fromDateInput.nativeElement.value = this.formatfecha(this.selectedInitDate);

        this.selectedEndDate = this.paramss.final_periodo
       // this.toDateInput.nativeElement.value = this.formatfecha(this.selectedEndDate) ;
        flatpickr(this.fromDateInput.nativeElement, {
          mode: 'range', // Activa el modo de rango
          dateFormat: 'd-m-Y',
          locale: Spanish,
          defaultDate: [this.formatfecha(this.selectedInitDate), this.formatfecha(this.selectedEndDate)],
          onChange: (selectedDates) => {
            if (selectedDates.length === 2) {
              //abrir alerta y mandar a guardar
              /* this.fromDateInput.nativeElement.value = selectedDates[0].toLocaleDateString();
              this.toDateInput.nativeElement.value = selectedDates[1].toLocaleDateString(); */
              this.startDate = selectedDates[0].toLocaleDateString().split('T')[0];
              this.endDate = selectedDates[1].toLocaleDateString().split('T')[0];

              this.validateDateRange(this.startDate,this.endDate);
            }
          }
        });
      })


    }

    getCalendarios(){
      let b = {
        accion : 'C',
        obra :this.obra.codigo,
        mesyano : this.quemesViene.quemes,
        tipo_proceso : this.quemesViene.tipo_proceso
      }
      this.paramSV.getCalendarioHoraExtra(b).subscribe((r:any)=>{
        console.log('UPDATE',r)
        this.paramss =r.result.parametros[0];
      })

    }

    updateCalendarioHoraExtra(){
      let b = {
        accion : 'U',
        obra :this.obra.codigo,
        mesyano : this.quemesViene.quemes,
        tipo_proceso : this.quemesViene.tipo_proceso,
        inicio_periodo : this.startDate,
        final_periodo : this.endDate
      }

      this.paramSV.getCalendarioHoraExtra(b).subscribe(r=>{
        console.log(r);
        Swal.fire('Calendario hora extra','Periodos actualizados con éxito','success');
        this.getCalendarios();
      })
    }

    validateDateRange(startDate ,endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const differenceInTime = end.getTime() - start.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);

      this.dateRangeInvalid = differenceInDays > 35;
    }
    dateRangeInvalid = false;
    @ViewChild('fromDate') fromDateInput!: ElementRef;
    @ViewChild('toDate') toDateInput!: ElementRef;


    onDateRangeChange(dateRange: any) {
      console.log(dateRange)
      this.dateRange = dateRange;
    }

    paramss:any;
    parametrosArray  =[];
    get(){
      this.parametrosArray=[];
      let b = {
        accion : 'C',
        obra :this.obra.codigo,
        mesyano : this.quemesViene.quemes,
        tipo_proceso : this.quemesViene.tipo_proceso
      }
      this.paramSV.getCalendarioHoraExtra(b).subscribe((r:any)=>{
        console.log(r);

        this.paramss =r.result.parametros[0];
        this.selectedInitDate = this.paramss.inicio_periodo
        this.fromDateInput.nativeElement.value = this.formatfecha(this.selectedInitDate);

        this.selectedEndDate = this.paramss.final_periodo
        this.toDateInput.nativeElement.value = this.formatfecha(this.selectedEndDate) ;
      })
    }

    selectedInitDate:any;
    selectedEndDate : any;
  formatfecha(fecha){
    let dia = fecha.split('-')[2];
    let mes = fecha.split('-')[1];
    let year = fecha.split('-')[0];

    return `${dia}-${mes}-${year}`;
  }

  cierre(tipo){


    console.log(tipo,this.paramss);
    this.paramss.tipo_proceso
    Swal.fire({
      title: 'Está seguro de que desea cerrar '+this.paramss.quemes+'?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Cerrar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let body = {accion : this.paramss.tipo_proceso};
        console.log(body)
        this.paramSV.cierre(body).subscribe(r=>{
          console.log(r);
          this.ToastrService.success('Para '+this.paramss.quemes,'Cierre realizado con éxito');

          //this.get();
        })
      } /* else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      } */
    })


  }

}
