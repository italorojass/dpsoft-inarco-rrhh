import { Component, Input } from '@angular/core';
import { ColDef, IGroupCellRendererParams } from 'ag-grid-community';
import { AgGridSpanishService } from '../../services/ag-grid-spanish.service';


@Component({
  selector: 'app-table-aggrid',
  templateUrl: './table-aggrid.component.html',
  styleUrls: ['./table-aggrid.component.css']
})
export class TableAggridComponent {
  @Input() datos :any
  @Input() columnas =[];


 defaultColDef: ColDef = {
    resizable: true,
    initialWidth: 200,

    sortable: true,
    filter: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    floatingFilter: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,


  };

  onRowClicked(event: any) {
    console.log(event.data)
  }

  save(){

  }



  public tooltipShowDelay = 0;
  public tooltipHideDelay = 2000;
  rowGroupPanelShow: 'always' | 'onlyWhenGrouping' | 'never' = 'always';
  pivotPanelShow: 'always' | 'onlyWhenPivoting' | 'never' = 'always';
  rowSelection: 'single' | 'multiple' = 'multiple';
  public overlayLoadingTemplate =
  '<span class="ag-overlay-loading-center">Recargando tabla, favor espere</span>';
public overlayNoRowsTemplate =
  '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">Cargando data..</span>';

  getRowId

  autoGroupColumnDef: ColDef = {
    headerName: 'Group',
    minWidth: 170,
    field: 'nombre',
    valueGetter: (params) => {
      if (params.node!.group) {
        return params.node!.key;
      } else {
        return params.data[params.colDef.field!];
      }
    },
    headerCheckboxSelection: true,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      checkbox: true,
    } as IGroupCellRendererParams,
  };

  localeText = this.localeTable.getLocale();

  constructor(private localeTable : AgGridSpanishService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getRowId = params => params.datos.id;
  }
/*
  sizeToFit() {
    this.gridApi.sizeColumnsToFit({
      defaultMinWidth: 100,
      columnLimits: [{ key: 'country', minWidth: 900 }],
    });
  } */
}
