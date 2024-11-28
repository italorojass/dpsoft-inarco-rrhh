import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ParametrosService } from './services/parametros.service';
import { ObrasService } from 'src/app/dashboard/obras/services/obras.service';
import Swal from 'sweetalert2';
import { ColDef, GridReadyEvent, ICellEditorParams, RowClassRules, RowValueChangedEvent, ValueFormatterParams } from 'ag-grid-community';
import { AgGridSpanishService } from '../../services/ag-grid-spanish.service';
import { AgGridAngular } from 'ag-grid-angular';
import { DatepickerAgGridComponent } from '../datepicker-ag-grid/datepicker-ag-grid.component';
import { DatepickerAgGridFinalComponent } from '../datepicker-ag-grid-final/datepicker-ag-grid-final.component';
import { environment } from 'src/environments/environment';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es'; // Importa el idioma español

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  nombreDias = ['Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo'];
  @ViewChild('fromDate') fromDateInput!: ElementRef;

  constructor(private fb : FormBuilder,
    private paramSV : ParametrosService,
    private ToastrService : ToastrService,
    private aggsv: AgGridSpanishService) { }

  formDate = this.fb.group({
    inicio : [''],
    final : [''],
    quincena : [],
    finmes : [],
    cantDias : [],
    primerDia : [],
    nombre_bono : ['']
  })
  opcionSeleccionada: string;
  api: any;
  columnApi;


  onGridReady(params: GridReadyEvent<any>) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    console.log('grid on ready', params);
  }
  onRowValueChanged(event: RowValueChangedEvent) {
    var data = event.data;
    console.log(data);
    this.saveEdit(data);
  }

  saveEdit(data){
    let body = {
    accion : 'G',
    id : data.id,
    final_periodo : data.final_periodo,
    inicio_periodo : data.inicio_periodo,
    estado1 : data.estado
    }
    this.paramSV.get(body).subscribe((res)=>{
      console.log('response edit',res);
      this.get();
    })
  }
  rowClassRules: RowClassRules = {
    // row style function
    'sick-days-danger': (params) => {

      return params.data.estado === 'C';
    },
    // row style expression

  };

  ngOnInit(): void {
    this.get();
    this.getMesesFuturos();

    let today = new Date();

    flatpickr(this.fromDateInput.nativeElement, {
      dateFormat: 'd-m-Y',
      locale: Spanish,
      defaultDate: [this.formatfecha(today.toISOString().split('T')[0])],
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          //abrir alerta y mandar a guardar
          /* this.fromDateInput.nativeElement.value = selectedDates[0].toLocaleDateString();
          this.toDateInput.nativeElement.value = selectedDates[1].toLocaleDateString(); */

        }
      }
    });

    //this.getFeriadosActuales();
  }
  feriados:any = [];
  columnDefsFeriados = [
    {
      field: 'nombre',
      headerName: 'Motivo',
      width : 280,
      suppressSizeToFit: true,
      editable : false,
    },
    {
      field: 'fecha',
      headerName: 'Fecha',
      editable : true,
      width : 200,
      //filter: 'agDateColumnFilter',
      //cellRenderer: DatepickerAgGridComponent,
      //cellEditor: DatepickerAgGridComponent,
      cellEditor: "agDateStringCellEditor",
      valueFormatter: (params: ValueFormatterParams<any>) => {
        if (!params.value) {
          return "";
        }
        return this.formatfecha(params.value);
      }
    },
    {
      field: 'irrenunciable',
      headerName: 'Irrenunciable',
      cellEditor: 'agSelectCellEditor',
      suppressSizeToFit: true,
      editable : false,
      suppressMenu: true,
      valueFormatter: this.formatFeriado,

      cellStyle: params => {
        // you can use either came case or dashes, the grid converts to whats needed
        // light green
        if (params.value ==1) {
          return { backgroundColor: '#ff5e5e', color : '#000' }
        } else if(params.value ==0) {
          return { backgroundColor: '#7ed321' };
        }else {
          return { backgroundColor: '#959595' };
        }
      },
    },

  ];
getFeriadosActuales(){
  let date = new Date;
  let year = date.getFullYear();

  this.paramSV.getFeriadosYear(year).subscribe((feriados)=>{
    console.log(feriados);
    this.feriados = feriados;
  })

}

dataFeriadosTest = [
  {
    "nombre": "Independencia Nacional",
    "comentarios": "",
    "fecha": "2014-09-18",
    "irrenunciable": "1",
    "tipo": "Civil",
    "leyes": [
      {
        "nombre": "Ley 2.977",
        "url": "http://www.leychile.cl/Navegar?idNorma=23639"
      },
      {
        "nombre": "Ley 19.973",
        "url": "http://www.leychile.cl/Navegar?idNorma=230132"
      }
    ]
  },
  {
    "nombre": "Día de las Glorias del Ejército",
    "comentarios": "",
    "fecha": "2014-09-19",
    "irrenunciable": "1",
    "tipo": "Civil",
    "leyes": [
      {
        "nombre": "Ley 2.977",
        "url": "http://www.leychile.cl/Navegar?idNorma=23639"
      },
      {
        "nombre": "Ley 20.629",
        "url": "http://www.leychile.cl/Navegar?idNorma=1043726"
      }
    ]
  }
]

  cellCellEditorParams = (params: ICellEditorParams<any>) => {
    //
    const selectedCountry = params.data.id;
    console.log('SELECTED', selectedCountry);
    let keys =['A','C'];

    return {
      values: keys,
      formatValue: (value) => `${value} (${selectedCountry})`,
    };
  };
  cellCellEditorParamsProceso = (params: ICellEditorParams<any>) => {
    //
    const selectedCountry = params.data.id;
    console.log('SELECTED', selectedCountry);
    let keys =['Q','F'];

    return {
      values: keys,
      formatValue: (value) => `${value} (${selectedCountry})`,
    };
  };

  columnDefs = [
    {
      field: 'quemes',
      headerName: 'Periodo actual',
      width : 280,
      suppressSizeToFit: true,
      editable : false,
    },
    {
      field: 'inicio_periodo',
      headerName: 'Primer día lunes del periodo',
      editable : true,
      width : 200,
      //filter: 'agDateColumnFilter',
      //cellRenderer: DatepickerAgGridComponent,
      //cellEditor: DatepickerAgGridComponent,
      cellEditor: "agDateStringCellEditor",
      cellRendererParams: {
        clicked: (field: any) => {
          console.log('item click', field);
        }
      },
      valueFormatter: (params: ValueFormatterParams<any>) => {
        if (!params.value) {
          return "";
        }
        return this.formatfecha(params.value);
      }
    },

    {
      field: 'final_periodo',
      //cellRenderer: DatepickerAgGridFinalComponent,
      headerName: 'Último día del periodo',
      suppressMenu: true,
      suppressSizeToFit: true,
      editable : true,
      width : 200,
      cellEditor: "agDateStringCellEditor",

    },
    {
      field: 'estado',
      headerName: 'Estado',
      cellEditor: 'agSelectCellEditor',
      suppressSizeToFit: true,
      editable : false,
      suppressMenu: true,
      cellEditorParams: this.cellCellEditorParams,
      valueFormatter: this.formatEstado,

      cellStyle: params => {
        // you can use either came case or dashes, the grid converts to whats needed
        // light green
        if (params.value =='C') {
          return { backgroundColor: '#ff5e5e', color : '#000' }
        } else if(params.value =='A') {
          return { backgroundColor: '#7ed321' };
        }else {
          return { backgroundColor: '#959595' };
        }
      },
    },
    {
      field: 'tipo_proceso',
      headerName: 'Tipo proceso',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: this.cellCellEditorParamsProceso,
      suppressSizeToFit: true,
      editable : false,
      valueFormatter: this.formatProceso,

    }
  ];
  gridOptions = {
    columnDefs: this.columnDefs,
    rowData: []
  };
  defaultColDef: ColDef = {
    resizable: true,

    editable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };
  rowSelection = this.aggsv.rowSelection;


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

          this.get();
        })
      } /* else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      } */
    })


  }
  obras =  JSON.parse(sessionStorage.getItem('obras')!);

  fechaFeriado = '';
  agregarFecha(){
    console.log('agregar fecha');
  }
  selectedObra = '';
  actualizarSueldos(){
    let body = {

    }
  this.paramSV.updateSueldos(body).subscribe(r=>{
    console.log(r);
    Swal.fire('Actualizar sueldos','Sueldos actualizados con éxito','success')
  })
  }

  formatFeriado(irrenunciable : ValueFormatterParams){

    return irrenunciable.value ==1 ? 'Si':'No';
  }

  formatEstado(estado : ValueFormatterParams){
    let value ='';
    switch(estado.value){
      case 1:
      value ='Abierto'
      break;
      case 'C' :
      value = 'Cerrado'
      break;
      default:
        value = 'Sin estado asignado'
      break;
    }
    return value;
  }

  formatProceso(estado: ValueFormatterParams){
    return estado.value == 'Q' ? 'Quincena' : 'Fin de mes';
  }

  @ViewChild('pGrid') grid!: AgGridAngular;

  paramss:any;
  parametrosArray  =[];
  get(){
    this.parametrosArray=[];
    let b = {
      accion : 'P'
    }
    this.paramSV.get(b).subscribe(r=>{
      console.log(r);
      this.parametrosArray = r['result'].parametros.filter(x=>x.estado != 'C');
      this.paramss = this.parametrosArray.find(x=>x.estado =='A');
      console.log('parametros ',this.paramss,this.parametrosArray);
      this.grid.api.sizeColumnsToFit();
      this.grid.api.setRowData(this.parametrosArray);

    })
  }

  getMesesFuturos(){
    let b = {
      accion : 'K'
    }
    this.paramSV.get(b).subscribe(r=>{
      console.log(r);
     /*  this.parametrosArray = r['result'].parametros.filter(x=>x.estado != 'C');
      this.paramss = this.parametrosArray.find(x=>x.estado =='A');
      console.log('parametros ',this.paramss,this.parametrosArray);
      this.grid.api.sizeColumnsToFit();
      this.grid.api.setRowData(this.parametrosArray); */

    })
  }



}

