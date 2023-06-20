
import { Component, OnInit, ViewChild } from '@angular/core';
import { CellClassParams, ColDef, GetRowIdFunc, GetRowIdParams, ICellEditorParams, RowValueChangedEvent } from 'ag-grid-community';
import { ObrasService } from 'src/app/dashboard/obras/services/obras.service';
import { AgGridSpanishService } from '../../services/ag-grid-spanish.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  @ViewChild('pGrid') grid!: AgGridAngular;

  constructor(private toast: ToastrService,private obrasSv: ObrasService, private aggsv : AgGridSpanishService) { }

  data: any = [];
  overlayLoadingTemplate = this.aggsv.overlayLoadingTemplate;
  overlayNoRowsTemplate = this.aggsv.overlayNoRowsTemplate;
  localeText = this.aggsv.getLocale();
  rowSelection = this.aggsv.rowSelection;
  columnDefs = [
    {
      headerName: 'ID',
      field: 'correlativo',
      width: 80,
      filter: false,
      floatingFilter: false,
      editable: false
    },
    {
      headerName: 'Código',
      field: 'codigo',
      width: 250,
      filter: true,
      floatingFilter: true,
      editable: false
    },
    {
      headerName: 'Proyecto',
      field: 'nombre',
      filter: true,
      floatingFilter: true,
      width: 450,

      editable: false
    },
    {
      headerName: 'Estado',
      field: 'estadoF',
      editable: true,
      filter: false,
      floatingFilter: false,
      width: 320,
      cellEditor: 'agSelectCellEditor',
      cellClass: params =>{return this.cellClas(params.value)},
      cellEditorParams: params =>{return this.cellCellEditorParams(params.value)},
    }
  ];

  cellCellEditorParams = (params: ICellEditorParams<any>) => {
    const selectedValue = params.data;
    let keys=['Activo','Inactivo']
     return {
       values: keys,
       formatValue: (value) => `${value} ${selectedValue}`,
     };
   };

  cellClas(params){

    return params ==='Activo' ? 'badge badge-success': 'badge badge-danger'
  }



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

  onGridReady(params){
    console.log('grid ready',params);
  }

  onRowValueChanged(event: RowValueChangedEvent) {
    var data = event.data;
    console.log('guardar',data);
    this.saveEdit(data);

  }


  getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.correlativo;
  gridOptions = {
    columnDefs: this.columnDefs,
    rowData: []
  };
  ngOnInit(): void {

 this.get()

  }

  get(){
    let b = {
      accion: 'C'
    }

    this.obrasSv.getb(b).subscribe(r => {
      console.log(r);
      let datarev = r['result'].obras.reverse();

      this.data = datarev.map((x, i) => {
        return {
          ...x,
          estadoF : x.estado==1 ? 'Activo' : 'Inactivo',
          correlativo : i+1
        }
      });
      this.grid.api.sizeColumnsToFit();
    /*   this.data.sort().reverse().map((x,i)=>{
        return {
          ...x,
          correlativo : i+1
        }
      }); */
      this.grid.api.setRowData(this.data);

    });
  }

  saveEdit(item) {
    console.log('modificado', item);
    let b = {
      accion: 'M',
      codigo : Number(item.codigo),
      estado: item.estadoF =='Activo' ? "1" : "0"
    }
    //console.log(b);
    this.obrasSv.getb(b).subscribe(r => {
      //console.log(r);
      this.toast.success('Actualizado con éxito', `Proyecto ${item.codigo} | ${item.nombre}`);
      this.get();
    })
  }

}
