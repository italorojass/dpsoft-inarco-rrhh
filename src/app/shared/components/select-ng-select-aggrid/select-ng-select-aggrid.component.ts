import { Component } from '@angular/core';
import { ProyectosService } from '../proyectos/services/proyectos.service';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-select-ng-select-aggrid',
  templateUrl: './select-ng-select-aggrid.component.html',
  styleUrls: ['./select-ng-select-aggrid.component.css']
})
export class SelectNgSelectAggridComponent {
  especialidades = [];
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);

  constructor(private ps: ProyectosService){

  }

  public cellValue!: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue =params.data;
    console.log('AG INIT',this.cellValue);
    let b = {
      tipo: 'pagos',
      obra: this.obra.codigo
    }
    this.ps.get(b).subscribe((data: any) => {
      console.log('response especialidades', data);
      this.especialidades = data['result']
    });
  }

  buttonClicked() {
    console.log(this.cellValue)

   /*  this.deletePago.dataEdit.next(this.cellValue); */


     //this.passData.dataEdit.next(format);
   }

   // gets called whenever the user gets the cell to refresh
   refresh(params: ICellRendererParams) {
     // set value into cell again
     //console.log('refresh fx',params);
     this.cellValue =params.data;
     return true;
   }

}
