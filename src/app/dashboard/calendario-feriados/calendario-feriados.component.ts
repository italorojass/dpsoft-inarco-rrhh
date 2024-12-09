import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { CentralizaPeriodosService } from 'src/app/shared/services/centraliza-periodos.service';
import { CalendarioFeriadosService } from './calendario-feriados.service';
import { switchMap } from 'rxjs';
import { ColDef, RowClassRules } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { InputHeaderComponent } from 'src/app/shared/components/table-aggrid/input-header/input-header.component';

@Component({
  selector: 'app-calendario-feriados',
  templateUrl: './calendario-feriados.component.html',
  styleUrls: ['./calendario-feriados.component.css']
})
export class CalendarioFeriadosComponent implements OnInit  {
  overlayLoadingTemplate = this.aggsv.overlayLoadingTemplate;
  overlayNoRowsTemplate = this.aggsv.overlayNoRowsTemplate;
  localeText = this.aggsv.getLocale();
  datosParametros:any;
  constructor(
    private BuildMonthService: BuildMonthService,
    private toast: ToastrService,
    public paramSV: ParametrosService,
    private aggsv: AgGridSpanishService,
    private periodos : CentralizaPeriodosService,
    private feriadosSV: CalendarioFeriadosService

  ) {}
  titlepage ='';
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  data=[];
  ngOnInit() {
    this.datosParametros = JSON.parse(sessionStorage.getItem('periodoAbierto'));
    this.titlepage = sessionStorage.getItem('titlePage');
    this.getAllData();

  }

  saveEdit(item) {
    let b = {
      accion: 'M',
      ...item.data,
    };
    console.log('body', b, item);
   /*  this.bonoSV.get(b).subscribe((r: any) => {
      console.log(r);

       this.getAllData();
      this.toast.success(
        'Actualizado con éxito',
        `Bono de ${item.data.nombre}`
      );
    }); */
  }

  formatRut(rut, dig) {
    return this.BuildMonthService.formatRut(rut, dig);
  }
  feriados = [];
  @ViewChild('Grid') agGrid: AgGridAngular;
  defaultColDef: ColDef = {
    resizable: true,
    initialWidth: 200,
    editable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };

  rowClassRules: RowClassRules = {
    // row style function
    'sick-days-warning': (params) => {

      return params.data.ciequicena === 'S';
    },
    // row style expression

  };
  columnDefs: ColDef[] = [
    {
      headerName: 'ID',
      field: 'correlativo',
      filter: false,
      floatingFilter: false,
      editable: false,
      width: 80,
      pinned: 'left',
      lockPinned: true,
    },
    {
      headerName: 'Nombre',
      field: 'nombre',
      filter: true,
      width: 250,
      floatingFilter: true,
      editable: false,
      pinned: 'left',
      lockPinned: true,
    },
    {
      headerName: 'RUT',
      field: 'rutF',
      filter: true,
      floatingFilter: true,
      editable: false,
      width: 200,
      pinned: 'left',
      lockPinned: true,
    },
    {
      headerName: 'N. de ficha',
      field: 'ficha',
      filter: false,
      floatingFilter: false,
      editable: false,
      width: 90,
      pinned: 'left',
      lockPinned: true,
      cellClass: (params) => {
        return this.dictFicha[params.value];
      },
    },
    {
      headerName: 'Días',
      field: 'dias',
      filter: false,
      floatingFilter: false,
      editable: false,
      width: 90,
      pinned: 'left',
      lockPinned: true,

    },
  ];
  dictFicha: any = {
    F1: 'badge-outline-primary',
    F2: 'badge-outline-info2',
    F3: 'badge-outline-warning2',
    F4: 'badge-outline-info',
    F5: 'badge-outline-danger2',
  };

  getAllData(){
    let body = {
      accion: 'C',
      obra: this.obra.codigo
    }
    //obtiene trabajadores
    this.feriadosSV.getb(body)
    this.feriadosSV.getb(body).subscribe(r=>{
      this.feriados = r['result'].feriados.map((value, i) => {
        return {
          ...value,
          correlativo: i + 1,
          rutF: this.formatRut(value.rut, value.dig),
          isEdit: false,
        };
      });
      console.log('response feriados', this.feriados);
      for (let i = 0; i < 5; i++) {

        if (this.feriados[i]) {
          let fechaFer ='';
          fechaFer = 'Feriado '+(i+1);
         /*  if(this.feriados[i].fechas_feriados){
            let fechas =this.feriados[i].fechas_feriados.split(';');
            fechaFer = fechas.map((x,i)=>{
              return x;
            });
          }else{
            fechaFer = 'Feriado '+(i+1);
          } */
          this.columnDefs.push({
            headerComponent: InputHeaderComponent,
            headerComponentParams: {
              label: fechaFer,
              index: i,
            },
            //headerName: this.bonos[i].descripcion,
            field: `feriado${i + 1}`,
            width: 150,
            filter: false,
            floatingFilter: false,
            editable : (params) => params.data.ciequicena !== 'S' && this.datosParametros.estado =='A',
            cellRenderer: this.CurrencyCellRenderer,
            cellRendererParams: {
              currency: 'CLP',
            },
          });
        } else {
          this.columnDefs.push({
            headerComponent: InputHeaderComponent,
            headerComponentParams: {
              index: i,
            },
            // headerName: '',
            field: `feriado${i + 1}`,
            width: 150,
            filter: false,
            floatingFilter: false,
            editable : (params) => params.data.ciequicena !== 'S' && this.datosParametros.estado =='A',
          });
        }
      }

      this.columnDefs.push({
        headerName: 'Total feriados',
        field: `total_feriados`,
        filter: false,
        floatingFilter: false,

        editable: false,
        cellRenderer: this.CurrencyCellRenderer,
        cellRendererParams: {
          currency: 'CLP',
        },
      });

      this.agGrid.api.setRowData(this.feriados);
      this.agGrid.api.setColumnDefs(this.columnDefs);

    })

  }

CurrencyCellRenderer(params: any) {
    return params.value ? params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '';
  }
}
