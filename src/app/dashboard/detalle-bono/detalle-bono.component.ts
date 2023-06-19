import { Component, OnInit, ViewChild } from '@angular/core';
import { BonosService } from './services/bonos.service';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { ToastrService } from 'ngx-toastr';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { ColDef } from 'ag-grid-community';
import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-detalle-bono',
  templateUrl: './detalle-bono.component.html',
  styleUrls: ['./detalle-bono.component.css']
})
export class DetalleBonoComponent implements OnInit {
  @ViewChild('Grid') agGrid: AgGridAngular;

  constructor(
    private bonoSV : BonosService,
    private BuildMonthService : BuildMonthService,
    private toast : ToastrService,
    private paramSV : ParametrosService,
    private aggsv : AgGridSpanishService) { }

  overlayLoadingTemplate = this.aggsv.overlayLoadingTemplate;
  overlayNoRowsTemplate = this.aggsv.overlayNoRowsTemplate;
  localeText = this.aggsv.getLocale();

   ngOnInit() {
     this.get();
     this.getBonos();

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

  columnDefs:ColDef[] = [ {
    headerName: 'ID',
    field: 'correlativo',
    filter: false,
    floatingFilter: false,
    editable : false,
    width:80
  },
  {
    headerName: 'Nombre',
    field: 'nombre',
    filter: true,
    floatingFilter: true,
    editable : false
  },
  {
    headerName: 'RUT',
    field: 'rutF',
    filter: true,
    floatingFilter: true,
    editable : false,
    width:200
  },
  {
    headerName: 'N. de ficha',
    field: 'ficha',
    filter: false,
    floatingFilter: false,
    editable : false,
    width:80,
    cellClass: params =>{return this.dictFicha[params.value];},
  },

];

dictFicha: any = {
  F1: 'badge-outline-primary',
  F2: 'badge-outline-info2',
  F3: 'badge-outline-warning2',
  F4: 'badge-outline-info',
  F5: 'badge-outline-danger2'
}
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  data : any=[];
  get(){
    let body = {
      tipo : 'bonos',
      obra : this.obra.codigo,
      accion: 'C'
    }
    this.bonoSV.get(body).subscribe((r:any)=>{
        //this.data = r.result.bonos;
        this.data = r.result.bonos.map((value,i) => {
          this.agGrid.api.sizeColumnsToFit();
          return {
            ...value,
            correlativo : i+1,
            rutF : this.formatRut(value.rut,value.dig),
            isEdit: false
          }
        });

        console.log(this.data)
    })
  }

  bonos=[];
   getBonos(){
    let b = {
      accion : 'C',
      obra: this.obra.codigo
    }
    this.paramSV.get(b).subscribe(r=>{
      console.log(r);
      this.bonos = r['result'].bonos.map((x,i)=>{
        return {
          key : `bono${i+1}`,
          descripcion : x.descripcion.trim()
        }
      });
      console.log('response parametros bonos agregados',this.bonos);
      for(let i=0;i<10;i++){
        if(this.bonos[i]){
          this.columnDefs.push({
            headerName: this.bonos[i].descripcion,
            field: `bono${i+1}`,
            filter: false,
            floatingFilter: false,
            editable : true
          })
        }/* else{
          this.columnDefs.push({
            headerName: '',
            field: `bono${i+1}`,
            filter: false,
            floatingFilter: false,
            editable : false
          })
        } */
      }

      this.columnDefs.push({
        headerName: 'Total bonos del mes',
        field: `total_bonos`,
        filter: false,
        floatingFilter: false,
        editable : false
      });

      this.agGrid.api.setColumnDefs(this.columnDefs);


    })
  }

  formatRut(rut,dig){

    return this.BuildMonthService.formatRut(rut,dig);
  }

  saveEdit(item){

    let b = {
      tipo: 'bonos',
      accion: 'M',
      obra: this.obra.codigo,
     ...item.data
    }
    console.log('body',b);
    this.bonoSV.get(b).subscribe((r: any) => {
      console.log(r);
     /*  let reemplazar = this.data.findIndex(x=>x.id == r['result'].bonos[0].id);
      this.data[reemplazar] = r['result'].bonos[0]; */
      this.get();
      this.toast.success('Actualizado con éxito',`Bono de ${item.nombre}`);


    })
  }


}
