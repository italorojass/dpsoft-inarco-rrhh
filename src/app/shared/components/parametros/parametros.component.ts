import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ParametrosService } from './services/parametros.service';
import { ObrasService } from 'src/app/dashboard/obras/services/obras.service';
import Swal from 'sweetalert2';
import { ColDef, GridReadyEvent, ICellEditorParams, RowClassRules, RowValueChangedEvent, ValueFormatterParams } from 'ag-grid-community';
import { AgGridSpanishService } from '../../services/ag-grid-spanish.service';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  nombreDias = ['Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo'];

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
  }


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

      suppressSizeToFit: true,
      editable : false,
    },
    {
      field: 'inicio_periodo',
      headerName: 'Primer día lunes del periodo',

      suppressSizeToFit: true,
      editable : true,
    },

    {
      field: 'final_periodo',
      headerName: 'Último día del periodo',
      suppressMenu: true,
      suppressSizeToFit: true,
      editable : true,
    },
    {
      field: 'estado',
      headerName: 'Estado',
      cellEditor: 'agSelectCellEditor',
      suppressSizeToFit: true,
      editable : true,
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


  cierre(tipo,msj){


    Swal.fire({
      title: 'Está seguro de que desea cerrar '+msj+'?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Cerrar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let body = {accion : tipo};
        console.log(body)
        this.paramSV.cierre(body).subscribe(r=>{
          console.log(r);
          this.ToastrService.success('Realizado con éxito',msj);

          this.get();
        })
      } /* else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      } */
    })


  }



  formatEstado(estado : ValueFormatterParams){
    let value ='';
    switch(estado.value){
      case 'A':
      value ='Abierto'
      break;
      case 'C' :
      value = 'Cerrado'
      break;
      case ' ':
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
      this.parametrosArray = r['result'].parametros;
      console.log('response parametros',this.parametrosArray,this.parametrosArray.find(x=>x.estado =='A'));
      this.paramss = this.parametrosArray.find(x=>x.estado =='A');
      this.grid.api.sizeColumnsToFit();

    })
  }





}

