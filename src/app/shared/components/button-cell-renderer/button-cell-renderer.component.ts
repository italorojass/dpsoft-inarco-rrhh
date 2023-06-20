import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { PassDataService } from './services/pass-data.service';

@Component({
  selector: 'app-button-cell-renderer',
  templateUrl: './button-cell-renderer.component.html',
  styleUrls: ['./button-cell-renderer.component.css']
})
export class ButtonCellRendererComponent implements ICellRendererAngularComp {

  public cellValue!: string;

  constructor(private passData : PassDataService){

  }

  // gets called once before the renderer is used
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
