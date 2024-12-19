import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-btn-eliminar-feriado-parametros',
  templateUrl: './btn-eliminar-feriado-parametros.component.html',
  styleUrls: ['./btn-eliminar-feriado-parametros.component.css']
})
export class BtnEliminarFeriadoParametrosComponent  implements ICellRendererAngularComp {
  public cellValue!: any;

  constructor(
   // private deletePago : EliminarPagoService
    ){

  }

  rolUser = sessionStorage.getItem('rolUser');

  agInit(params: ICellRendererParams): void {
    this.cellValue =params.data;
    //console.log('AG INIT',params.data)
  }
  buttonClicked(typeClick : string) {
    //console.log(this.cellValue)
    this.cellValue = {
      ...this.cellValue,
      tipoClick : typeClick
    }
   // this.deletePago.dataEdit.next(this.cellValue);


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
