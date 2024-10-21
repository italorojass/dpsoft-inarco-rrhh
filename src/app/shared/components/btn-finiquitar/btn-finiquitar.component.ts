import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { PassDataService } from '../button-cell-renderer/services/pass-data.service';

@Component({
  selector: 'app-btn-finiquitar',
  templateUrl: './btn-finiquitar.component.html',
  styleUrls: ['./btn-finiquitar.component.css']
})
export class BtnFiniquitarComponent {
 // gets called once before the renderer is used

 public cellValue!: string;

 constructor(private passData : PassDataService){

 }

 agInit(params: ICellRendererParams): void {
  this.cellValue =params.data;
  //console.log('AG INIT',params.data)
}


buttonClicked(asoc) {
  console.log(this.cellValue)
  let format = {
    accion : asoc,
    data : this.cellValue
  }
  this.passData.dataEdit.next(format);
}

// gets called whenever the user gets the cell to refresh
refresh(params: ICellRendererParams) {
  // set value into cell again
  console.log('refresh fx',params);
  this.cellValue =params.data;
  return true;
}
}
