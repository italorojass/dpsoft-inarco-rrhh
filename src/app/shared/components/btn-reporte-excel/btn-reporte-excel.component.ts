import { BonosService } from './../../../dashboard/detalle-bono/services/bonos.service';
import { Component, Input } from '@angular/core';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import * as XLSX from 'xlsx';
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

  constructor(private BonosService : BonosService){

  }

  buildReporte(from1){
    let excelData = [];


    switch(from1){
      case 'hh' :
        excelData = this.data.map(x=>{
          let b =  {
            rut : `${x.rut}-${x.dig}`,
            ficha : x.ficha,
            horasext50 : Number(x.tothormes)
          }

          return b;
        })

        const wb1 = XLSX.utils.book_new();
        const ws1: any = XLSX.utils.json_to_sheet([]);
        XLSX.utils.sheet_add_aoa(ws1, this.headings);
        XLSX.utils.sheet_add_json(ws1, excelData, { origin: 'A2', skipHeader: true });
        XLSX.utils.book_append_sheet(wb1, ws1, this.sheetName);
        XLSX.writeFile(wb1, `${this.fileName}.xlsx`);

      break;

      case 'bonos' :
        //consultar y crear el objeto que retorna
        let obra=JSON.parse(sessionStorage.getItem('obraSelect')).codigo
        let body = {
          tipo : 0,
          accion : 'R',
          obra : obra
        }

        this.BonosService.get(body).subscribe((r:any)=>{
          excelData = r.result.bonos
	       /*  for(let i in excelData){
            console.log("excelData",i,"-",excelData[i]);
          } */
          console.log('data excel',excelData);
          const source = from(excelData);
          //group by age
          const example = source.pipe(
            groupBy((person:any) => person.orden),
            // return each item in group as array
            mergeMap((group:any) => group.pipe(toArray()))
          );
          example.subscribe((val:any) => {

            console.log(val)
            const wb = XLSX.utils.book_new();
          const ws: any = XLSX.utils.json_to_sheet([]);
        XLSX.utils.sheet_add_aoa(ws, this.headings);
        XLSX.utils.sheet_add_json(ws, val, { origin: 'A2', skipHeader: true });
        XLSX.utils.book_append_sheet(wb, ws, this.sheetName);
        XLSX.writeFile(wb, `${this.fileName}_${val[0].orden.trim()}.xlsx`);
          });

          /* const wb = XLSX.utils.book_new();
          const ws: any = XLSX.utils.json_to_sheet([]);
        XLSX.utils.sheet_add_aoa(ws, this.headings);
        XLSX.utils.sheet_add_json(ws, excelData, { origin: 'A2', skipHeader: true });
        XLSX.utils.book_append_sheet(wb, ws, this.sheetName);
        XLSX.writeFile(wb, `${this.fileName}.xlsx`); */

        })
        /* excelData = this.data.filter(x=> x.total_bonos > 0).map(x=>{
          let b =  {
            rut : x.rutF,
            ficha : x.ficha,
            valor : Number(x.total_bonos),
            detalle : ''
          }

          return b;
        }); */

      break;
      case 'sabdom':
        excelData = this.data.map(x=>{
          let b =  {
            rut : x.rutF,
            ficha : x.ficha,
            difMensualSabado : Number(x.total_mensual_sab),
            difMensualdomingo : Number(x.total_mensual_dom),
            detalle : ''
          }

          return b;
        });

        const wb = XLSX.utils.book_new();
        const ws: any = XLSX.utils.json_to_sheet([]);
              XLSX.utils.sheet_add_aoa(ws, this.headings);
              XLSX.utils.sheet_add_json(ws, excelData, { origin: 'A2', skipHeader: true });
              XLSX.utils.book_append_sheet(wb, ws, this.sheetName);
              XLSX.writeFile(wb, `${this.fileName}.xlsx`);

      break;
    }




  }
}
