import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-datepicker-ag-grid-final',
  templateUrl: './datepicker-ag-grid-final.component.html',
  styleUrls: ['./datepicker-ag-grid-final.component.css']
})
export class DatepickerAgGridFinalComponent {
  selectedDate:any
  dataEdit = new Subject();
  public cellValue!: string;

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.cellValue =this.formatfecha(params.data.final_periodo);
    //console.log('AG INIT',params.data)
  }

  formatfecha(fecha){
    let dia = fecha.split('-')[2];
    let mes = fecha.split('-')[1];
    let year = fecha.split('-')[0];

    return `${dia}-${mes}-${year}`;
  }


  buttonClicked(asoc) {
    console.log(this.cellValue)
    let format = {
      accion : asoc,
      data : this.cellValue
    }
    this.dataEdit.next(format);
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    // set value into cell again
    console.log('refresh fx',params);
    this.cellValue =this.formatfecha(params.data.final_periodo);
     return true;
  }
}
