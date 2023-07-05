import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DetallePagoService } from '../detalle-pago/services/detalle-pago.service';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { DifSabDomService } from './services/dif-sab-dom.service';
import { ButtonCellRendererComponent } from 'src/app/shared/components/button-cell-renderer/button-cell-renderer.component';
import { ColDef, GridReadyEvent, RowValueChangedEvent } from 'ag-grid-community';
import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
import { AgGridAngular } from 'ag-grid-angular';
@Component({
  selector: 'app-diferencia-sab-dom',
  templateUrl: './diferencia-sab-dom.component.html',
  styleUrls: ['./diferencia-sab-dom.component.css']
})
export class DiferenciaSabDomComponent implements OnInit {

  constructor(private bm: BuildMonthService, private sb: DifSabDomService, private toast: ToastrService,
    private aggsv: AgGridSpanishService) { }
    @ViewChild('heGrid') grid!: AgGridAngular;

  ngOnInit(): void {
    this.get();
    this.buildTbl();
    this.buildHeader();
  }

  data: any = [];
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  get() {

    let body = {
      tipo: 'finde',
      accion: 'C',
      obra: this.obra.codigo
    }
    let c = 0;
    this.sb.get(body).subscribe((r: any) => {
      this.data = r.result.sab_dom.map((value) => {
        c++
        return {
          ...value,
          correlativo: c,
          isEdit: false
        }
      });
      console.log(this.data);

    })
  }

  sem: any = [];
  buildHeader() {
    let date = new Date();
    let semenas = this.bm.getWeeksInMonth(date.getFullYear(), date.getMonth());
    //console.log(semenas);
    this.sem = semenas;
  }

  saveEdit(item) {
    item.isEdit = false;
    let b = {
      accion: 'M',
      //obra: this.obra.codigo,
      id_detalle_pagos: item.id_pagos1,
      val_sab_med: Number(item.sab_medio_sem1),
      val_sab_ent: Number(item.sab_entero_sem1),
      val_dom_med: Number(item.dom_medio_sem1),
      val_dom_ent: Number(item.dom_entero_sem1)
    }

    console.log('body edit', b);
    this.sb.get(b).subscribe((r: any) => {
      console.log(r);

      this.toast.success('Actualizado con éxito', `Pago trabajador ${item.nombre}`);


    })
  }

  columnDefs = [

  ];
  api: any;
  columnApi;
  onGridReady(params: GridReadyEvent<any>) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    console.log('grid on ready', params)
  }



  onRowValueChanged(event: RowValueChangedEvent) {
    var data = event.data;
    console.log(data);
    this.saveEdit(data)

  }
  buildTbl() {
    this.columnDefs.push(
      /* {
      headerName: 'Acciones',
      cellRenderer: ButtonCellRendererComponent,
      cellRendererParams: {
        clicked: (field: any) => {
          console.log('item click', field);
        }
      },
      pinned: 'left',
      filter: false,
      floatingFilter: false,
      width: 100,
      autoHeight: true
    }, */
      {
        headerName: 'ID', field: 'correlativo',
        width: 80,
        pinned: 'left',
        filter: false,
        floatingFilter: false,
        editable: false
      },
      {
        field: 'nombre',
        headerName: 'Nombre',
        width: 250,
        suppressSizeToFit: true,
        suppressStickyLabel: true,
        pinned: 'left',
        lockPinned: true,
        cellClass: 'lock-pinned',
        editable: false
      },
      {
        field: 'cargo',
        headerName: 'Cargo',
        width: 250,
        sortable: true,
        pinned: 'left',
        editable: false
      },
      {
        headerName: 'Semana 1',
        editable: true,
        children: [
          {
            headerName: 'H. extra sábado',
            field: 'h_ex_sabado_sem1',

            width: 100,
            sortable: true,
            lockPinned: false,
            editable: false
          },
          {
            field: 'valor_hora',
            headerName: 'Valor hora',
            width: 100,
            sortable: true,
            editable: false,
            cellRenderer: this.CurrencyCellRenderer, cellRendererParams: {
              currency: 'CLP'
            },
          },
          {
            field: 'total_sab_sem1',
            headerName: 'Total',
            width: 100,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer, cellRendererParams: {
              currency: 'CLP'
            },
            editable: false
          },
          {
            field: 'sab_medio_sem1',
            headerName:
              'Valor sábado 1/2 día',
            width: 110,
            sortable: true,
            editable: true,
            cellRenderer: this.CurrencyCellRenderer, cellRendererParams: {
              currency: 'CLP'
            },
          },
          {
            field: 'sab_entero_sem1',
            headerName: 'Valor día sábado',
            width: 100,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: true
          },
          {
            field: 'h_ex_domingo_sem1',
            headerName: 'H. extras domingo',
            width: 150,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: false
          },
          {
            field: 'tot_dom_sem1',
            headerName: 'Total',
            width: 100,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: false
          },
          {
            field: 'dom_medio_sem1',
            headerName: 'Valor domingo 1/2 día',
            width: 180, sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: true
          },
          {
            field: 'dom_entero_sem1',
            headerName: 'Valor día domingo',
            width: 150,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: true
          },
          {
            field: 'dif_sab_sem1',
            headerName: 'Diferencia días sábado',
            width: 180,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: false
          },
          {
            field: 'dif_dom_sem1',
            headerName: 'Diferencia día domingo',
            width: 180,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: false
          },
        ]
      })
    for (let i = 2; i < 6; i++) {
      this.columnDefs.push(
        {
          headerName: 'Semana ' + i,
          marryChildren: true,
          children: [
            {
              field: 'h_ex_sabado_sem' + i,
              headerName: 'H. extras Sábado ',
              width: 120,
              sortable: true,
              editable: false
            },
            {
              field: 'total_sab_sem' + i,
              headerName: 'Total',
              width: 100,
              sortable: true,
              editable: false
            },
            {
              field: 'dif_sab_sem' + i,
              headerName: 'Diferencia día sábado',
              width: 130,
              sortable: true,
              editable: false
            },
            {
              field: 'h_ex_domingo_sem' + i,
              headerName: 'H. extras domingo ',
              width: 110,
              sortable: true,
              editable: false
            },
            {
              field: 'tot_dom_sem' + i,
              headerName: 'Total',
              width: 100,
              sortable: true,
              editable: false
            },
            {
              field: 'dif_dom_sem' + i,
              headerName: 'Diferencia día domingo',
              width: 150,
              sortable: true,
              editable: false
            },
          ]

        }
      )
    }

    this.columnDefs.push({
      field: 'total_mensual_sab',
      headerName: 'Diferencia mensual sábado',
      width: 120, sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      pinned: 'right',
      lockPinned: true,
      editable: false
    },
      {
        field: 'total_mensual_dom',
        headerName: 'Diferencia mensual domingo',
        width: 120,
        sortable: true,
        cellRenderer: this.CurrencyCellRenderer,
        pinned: 'right',
        lockPinned: true,
        editable: false
      }
    )

  }

  rowSelection = this.aggsv.rowSelection;
  overlayLoadingTemplate = this.aggsv.overlayLoadingTemplate;
  overlayNoRowsTemplate = this.aggsv.overlayNoRowsTemplate;
  localeText = this.aggsv.getLocale();

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
  CurrencyCellRenderer(params: any) {

    var usdFormate = new Intl.NumberFormat();
    return usdFormate.format(params.value);
  }

}
