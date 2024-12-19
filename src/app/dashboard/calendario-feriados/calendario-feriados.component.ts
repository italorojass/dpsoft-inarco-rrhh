import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { CentralizaPeriodosService } from 'src/app/shared/services/centraliza-periodos.service';
import { CalendarioFeriadosService } from './calendario-feriados.service';
import { switchMap } from 'rxjs';
import { CellEditRequestEvent, ColDef, GetRowIdFunc, GetRowIdParams, GridApi, GridOptions, GridReadyEvent, RowClassRules, RowValueChangedEvent } from 'ag-grid-community';
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
  @ViewChild('AgGrid') agGrid: AgGridAngular;

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


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    // placing in 13 rows, so there are exactly enough rows to fill the grid, makes
    // the row animation look nice when you see all the rows
   // this.gridApi.setRowData(this.data);

  }

  onRowValueChanged(event: CellEditRequestEvent) {

    console.log('guardar', event);
    const data = event.data;
    const field = event.colDef.field;
    const newValue = event.newValue;
    const oldItem = this.feriados.find((row) => row.id === data.id);
    if (!oldItem || !field) {
      return;
    }
    const newItem = { ...oldItem };
    console.log('newItem', newItem);
    newItem[field] = newValue;
    this.getChanges(newItem);
    //this.getChanges(data);

  }
  getChanges(item) {
    //console.log('este cambiar', e);

    let b = {
      accion: 'M',
      obra: Number(this.obra.codigo),
      id_detalle_pagos: item.id_detalle_pagos,
      feriado1: Number(item.feriado1) || '0',
      feriado2: Number(item.feriado2) || '0',
      feriado3: Number(item.feriado3) || '0',
      feriado4: Number(item.feriado4) || '0',
      feriado5: Number(item.feriado5) || '0'
    };
    console.log('body', b);
    this.feriadosSV.getb(b).subscribe((r: any) => {
      console.log(r);
      const rowNode = this.gridOptions.api.getRowNode(item.id);
          if (rowNode) {
            // Actualiza los datos de la fila
            let data = r.result[0];
            console.log('data response', data[0]);
            rowNode.setData(data[0]);
          }
      /* this.agGrid.api.getPinnedBottomRow(5);
      this.agGrid.api.getDisplayedRowCount(); */
    });

    // console.log('body edit', body1);
   /*  this.dtSv.get(body1).subscribe(r => {
      console.log('response edit', r);
      this.toastr.success('Actualizado con éxito', `trabajador ${e.nombre}`);
      const rowNode = this.gridOptions.api.getRowNode(e.id);
      if (rowNode) {
        rowNode.setData(e);  // Actualiza solo la fila con la nueva data
      }

      this.grid.api.getPinnedBottomRow(5);
      this.grid.api.getDisplayedRowCount();

      //this.getPagos();

    })*/

  }

  public getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    // console.log('params', params);
     return params.data.id;
   };
   private gridApi!: GridApi;
  saveEdit(item) {
    let b = {
      accion: 'M',
      obra: this.obra.codigo,
      id_detalle_pagos: String(item.data.id_detalle_pagos),
      feriado1: item.data.feriado1 || '0',
      feriado2: item.data.feriado2 || '0',
      feriado3: item.data.feriado3 || '0',
      feriado4: item.data.feriado4 || '0',
      feriado5: item.data.feriado5 || '0'
    };
    console.log('body', b);
    const rowNode = this.gridApi.getRowNode(item.data.id_detalle_pagos);
    console.log('rowNode', rowNode);
    if (rowNode) {
      // Actualiza los datos de la fila
      rowNode.setData(item.data);
    }
    /* this.feriadosSV.getb(b).subscribe((r: any) => {
      console.log(r.result[0]);
      let data = r.result[0];
      console.log('data', data[0]);
      const rowNode = this.agGrid.api.getRowNode(item.data.id_detalle_pagos);
      console.log('rowNode', rowNode);
      if (rowNode) {

        rowNode.setData(data[0]);
        this.agGrid.api.setRowData(data[0]);
      }

      //this.getAllData();

      this.toast.success(
        'Actualizado con éxito',
        `Feriado de ${item.data.nombre}`
      );
    }); */
  }

  formatRut(rut, dig) {
    return this.BuildMonthService.formatRut(rut, dig);
  }
  feriados = [];
  defaultColDef: ColDef = {
    resizable: true,
    initialWidth: 200,
    enableCellChangeFlash: true,
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
      enableCellChangeFlash: true,
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
      enableCellChangeFlash: true,
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
      enableCellChangeFlash: true,
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
      enableCellChangeFlash: true,
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
      enableCellChangeFlash: true,
    },
  ];

  gridOptions = <GridOptions>{
    columnDefs: this.columnDefs,
    rowData: [],
    pinnedBottomRowData: [],
    rowSelection: 'multiple', // Habilita selección múltiple
    suppressRowClickSelection: false // Permite seleccionar filas al hacer clic
  };
  dictFicha: any = {
    F1: 'badge-outline-primary',
    F2: 'badge-outline-info2',
    F3: 'badge-outline-warning2',
    F4: 'badge-outline-info',
    F5: 'badge-outline-danger2',
  };
  feriadosTotales:any;
  getAllData(){
    let bodyNombres = {
      accion: 'C',
      obra: this.obra.codigo,
      mesyano: this.datosParametros.quemes
    }
    console.log('bodyNombres', bodyNombres);
    //obtiene trabajadores
    this.feriadosSV.getNombresFeriados(bodyNombres).pipe(
      switchMap((r:any)=>{
        console.log('feriados', r);
        this.feriadosTotales= r.result.feriados.map((value, i) => {
          let feriado = value.Feriados.split(':');
          console.log('feriado', feriado);
          return {
            key: feriado[0],
            nombre: feriado[1],
          };
        });

        console.log('feriadosTotales', this.feriadosTotales);


        let body = {
          accion: 'C',
          obra: this.obra.codigo
        }
      return  this.feriadosSV.getb(body)
      })
    ).subscribe(r=>{
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

        if (this.feriadosTotales[i]) {

          this.columnDefs.push({
            headerComponent: InputHeaderComponent,
            headerComponentParams: {
              label: this.feriadosTotales[i].nombre ,
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
         /*  if(this.feriados[i].fechas_feriados){
            let fechas =this.feriados[i].fechas_feriados.split(';');
            fechaFer = fechas.map((x,i)=>{
              return x;
            });
          }else{
            fechaFer = 'Feriado '+(i+1);
          } */
         /*  this.columnDefs.push({
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
          }); */
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
      //this.data = this.feriados;
     this.agGrid.api.setRowData(this.feriados);
      this.agGrid.api.setColumnDefs(this.columnDefs);

    })

  }

CurrencyCellRenderer(params: any) {
    return params.value ? params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '';
  }
}
