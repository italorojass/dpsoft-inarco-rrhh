import { Component, Input } from '@angular/core';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
@Component({
  selector: 'app-btn-reporte-excel',
  templateUrl: './btn-reporte-excel.component.html',
  styleUrls: ['./btn-reporte-excel.component.css']
})
export class BtnReporteExcelComponent {

  @Input() data :any;
  @Input() headings:any;
  @Input() sheetName : any;
  @Input() fileName : any;
  @Input() _from : any;

  buildReporte(from){
    let excelData = [];
    switch(from){
      case 'hh' :
        excelData = this.data.map(x=>{
          let b =  {
            rut : `${x.rut}-${x.dig}`,
            ficha : x.ficha,
            horasext50 : Number(x.tothormes)
          }

          return b;
        })
      break;

      case 'bonos' :
        excelData = this.data.filter(x=> x.total_bonos > 0).map(x=>{
          let b =  {
            rut : x.rutF,
            ficha : x.ficha,
            valor : Number(x.total_bonos),
            detalle : ''
          }

          return b;
        });


      break;
    }


  const wb = XLSX.utils.book_new();
  const ws: any = XLSX.utils.json_to_sheet([]);
        XLSX.utils.sheet_add_aoa(ws, this.headings);
        XLSX.utils.sheet_add_json(ws, excelData, { origin: 'A2', skipHeader: true });
        XLSX.utils.book_append_sheet(wb, ws, this.sheetName);
        XLSX.writeFile(wb, `${this.fileName}.xlsx`);

  }
}
