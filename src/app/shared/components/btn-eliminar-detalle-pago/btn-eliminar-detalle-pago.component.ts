import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EliminarPagoService } from './service/eliminar-pago.service';

@Component({
  selector: 'app-btn-eliminar-detalle-pago',
  templateUrl: './btn-eliminar-detalle-pago.component.html',
  styleUrls: ['./btn-eliminar-detalle-pago.component.css']
})
export class BtnEliminarDetallePagoComponent implements ICellRendererAngularComp  {
  public cellValue!: any;

  constructor(
    private deletePago : EliminarPagoService
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
   this.deletePago.dataEdit.next(this.cellValue);


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
