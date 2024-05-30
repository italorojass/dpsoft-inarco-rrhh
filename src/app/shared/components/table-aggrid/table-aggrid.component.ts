import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CellValueChangedEvent, ColDef, ColumnApi, GridApi, GridReadyEvent, IGroupCellRendererParams, RowClassParams, RowNode, RowStyle, RowValueChangedEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';


@Component({
  selector: 'app-table-aggrid',
  templateUrl: './table-aggrid.component.html',
  styleUrls: ['./table-aggrid.component.css']
})
export class TableAggridComponent {
  @Input() datos: any;
  @Input() columnas = [];
  @Input() paginationNumber=16;
  @Output() outChange = new EventEmitter<any>();

  @ViewChild('Grid') grid!: AgGridAngular;

  @Input() pinnedBottomRowData: any[]
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



  getRowId
  rowSelection = this.aggsv.rowSelection;
  overlayLoadingTemplate = this.aggsv.overlayLoadingTemplate;
  overlayNoRowsTemplate = this.aggsv.overlayNoRowsTemplate;



  constructor(private aggsv: AgGridSpanishService) { }
  rowData = [];
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.


    if (this.aggsv.dataNex) {
      this.aggsv.dataNex.subscribe(data => {
        this.grid.api.sizeColumnsToFit();
        this.getRowId = params => params.datos.id;
      })
    }

  }



  onRowClicked(event: any) {
    // console.log(event.data)
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    /* console.log(
      'onCellValueChanged: ' + event.colDef.field + ' = ' + event.newValue, event
    ); */
    //this.outChange.emit(event);
  }

  onRowValueChanged(event: RowValueChangedEvent) {
    var data = event.data;
    console.log(data);
    this.outChange.emit(event);
  }

  onGridReady(params: GridReadyEvent<any>) {
    this.grid.api.sizeColumnsToFit();
    this.grid.api = params.api;

    /*   this.gridApi = params.api;
      this.grid.api = params.api */
  }

}
