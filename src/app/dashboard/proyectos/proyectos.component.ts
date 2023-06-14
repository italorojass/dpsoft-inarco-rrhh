import { AgGridSpanishService } from './../../shared/services/ag-grid-spanish.service';
import { Component, OnInit } from '@angular/core';
import { ProyectosService } from './services/proyectos.service';
import { ObrasService } from '../obras/services/obras.service';
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  constructor(private obrasSv : ObrasService, private AgGridSpanishService : AgGridSpanishService) { }

  data :any=[];
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);

  columnDefs: ColDef[] = [

    { headerName : 'Código',field: 'codigo' },
    { headerName : 'Proyecto',field: 'nombre' },
    { headerName : 'Estado',field: 'estado' , editable : true}
];
defaultColDef = {
  sortable: true,
  filter: true
};



rowData =[];
getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.correlativo;
dtOptions: DataTables.Settings = {};

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };

    let b = {

      cod_obra: this.obra.codigo,
      accion: 'C',

    }

    this.obrasSv.getb(b).subscribe(r=>{
      console.log(r);
      this.data = r['result'].obras.map((x,i)=>{
        return {
          ...x,
          isEdit : false,
          correlativo : i+1
        }
      });

      this.data.sort().reverse();
      this.rowData = r['result'].obras.map(x=>{
        return {
          ...x,
          estado : x.estado=='0' ? 'Inactivo' : 'Activo'
        }
      }).reverse();


    });

  }

  saveEdit(item){
    console.log('modificado',item);
    let b = {

      cod_obra: item.codigo,
      accion: 'M',
      estado : item.estado
    }
    console.log(b);
    this.obrasSv.getb(b).subscribe(r=>{
      console.log(r);
      item.isEdit=false;
    })
  }

}
