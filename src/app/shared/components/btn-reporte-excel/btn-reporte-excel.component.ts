import { BonosService } from './../../../dashboard/detalle-bono/services/bonos.service';
import { Component, Input } from '@angular/core';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { DifSabDomService } from 'src/app/dashboard/diferencia-sab-dom/services/dif-sab-dom.service';
import { ReporteService } from 'src/app/dashboard/reporte/service/reporte.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-btn-reporte-excel',
  templateUrl: './btn-reporte-excel.component.html',
  styleUrls: ['./btn-reporte-excel.component.css']
})
export class BtnReporteExcelComponent {

  @Input() data: any;
  @Input() headings: any;
  @Input() sheetName: any;
  @Input() fileName: any;
  @Input() _from: any;

  constructor(private BonosService: BonosService, private sabdom: DifSabDomService,private reporteSV : ReporteService) {

  }

  buildReporte(from1) {
    let excelData = [];

    let obra = JSON.parse(sessionStorage.getItem('obraSelect'))?.codigo
    const wb = XLSX.utils.book_new();
    const ws: any = XLSX.utils.json_to_sheet([]);
    console.log('data reporte excel', this.data);
    switch (from1) {
      case 'dp':

        excelData = this.data.filter(v => v.ciequincena != 'S').map(x => {
          let b = {
            finiq: x.finiq,
            nombre: x.nombre,
            rut: `${x.rut}-${x.dig}`,
            ficha: x.ficha,
            especialidad: x.descripcion,
            sueldo_liq: Number(x.sueldo_liq),
            dias: x.dias,
            valor_hora: Number(x.valor_hora),
            total_periodo: Number(x.total_periodo),
            horaLunesSabado: x.hor_lun_sab,
            totalValorHoraExtra: Number(x.val_lun_sab),
            diferenciaSabado: Number(x.difer_sabado),
            diferenciaDom: Number(x.difer_domingo),
            totalBonos: Number(x.total_bonos),
            zona10: Number(x.zona10),
            viatico: Number(x.viatico),
            aguinaldo: Number(x.aguinaldo),
            asignaciones: Number(x.asignaciones),
            ajuste_positivo: Number(x.ajuste_pos),
            totalGanado: Number(x.total_ganado),
            anticipos: Number(x.anticipo),
            descuentos: Number(x.dctos_varios),
            remuneracion: Number(x.a_pagar),
            finiquitoQuincena: Number(x.finiquito),
            finiquitoFinDemes: Number(x.finiquito_findemes),
            liquido_apagar: Number(x.liq_apagar)
          }

          return b;
        })
        XLSX.utils.sheet_add_aoa(ws, this.headings);
        XLSX.utils.sheet_add_json(ws, excelData, { origin: 'A2', skipHeader: true });
        XLSX.utils.book_append_sheet(wb, ws, this.sheetName);


        XLSX.writeFile(wb, `${this.fileName}.xlsx`);
        break;
      case 'hh':
        excelData = this.data.filter(v => v.ciequincena != 'S').map(x => {
          let b = {
            rut: `${x.rut}-${x.dig}`,
            ficha: x.ficha,
            horasext50: Number(x.tothormes)
          }

          return b;
        })


        XLSX.utils.sheet_add_aoa(ws, this.headings);
        XLSX.utils.sheet_add_json(ws, excelData, { origin: 'A2', skipHeader: true });
        XLSX.utils.book_append_sheet(wb, ws, this.sheetName);


        XLSX.writeFile(wb, `${this.fileName}.xlsx`);
        break;

      case 'bonos':
        //consultar y crear el objeto que retorna
        //let obra=JSON.parse(sessionStorage.getItem('obraSelect')).codigo
        let body = {
          tipo: 0,
          accion: 'R',
          obra: obra
        }

        this.BonosService.get(body).subscribe((r: any) => {
          excelData = r.result.bonos

          console.log('data excel', r.result.bonos);
          const source = from(excelData);
          //group by age
          const example = source.pipe(
            groupBy((person: any) => person.orden),
            // return each item in group as array
            mergeMap((group: any) => group.pipe(toArray()))
          );
          let count = 0;

          example.subscribe((val: any) => {
            count++;
            console.log(val);
            var ws2 = XLSX.utils.json_to_sheet([]);
            XLSX.utils.sheet_add_aoa(ws2, this.headings);
            XLSX.utils.sheet_add_json(ws2, val, { origin: 'A2', skipHeader: true });

            XLSX.utils.book_append_sheet(wb, ws2, val[0].orden.trim().toUpperCase());

          });
          XLSX.writeFile(wb, `${this.fileName}.xlsx`);


        })


        break;
      case 'sabdom':
        let body1 = {
          tipo: 'finde',
          accion: 'R',
          obra: obra
        }
        this.sabdom.get(body1).subscribe((r: any) => {

          excelData = r.result.sab_dom.map(x => {

            return {
              rut: x.rut,
              ficha: x.ficha,
              total_sab: Number(x.total_mensual_sab),
              total_dom: Number(x.total_mensual_dom),
              detalle: ''
            }
          })

          XLSX.utils.sheet_add_aoa(ws, this.headings);
          XLSX.utils.sheet_add_json(ws, excelData, { origin: 'A2', skipHeader: true });
          XLSX.utils.book_append_sheet(wb, ws, this.sheetName);
          XLSX.writeFile(wb, `${this.fileName}.xlsx`);
        })
        break;

      case 'comparativo':
        //crear el excel comparativo
        excelData = this.data.map(x=>{
            return {
              rut : x.rutF,
              nombreCompleto: x.nombre,
              obra : x.obra,
              diasSistema : x.dias_sistema,
              diasBuk : x.dias_buk,
              diferencia_dias : x.diferencia_dias,
              anticipo_sistema : x.anticipo_sistema,
              anticipo_buk : x.anticipo_buk,
              diferencia_anticipo : x.diferencia_anticipo,
              finiquito_sistema : x.finiquito_sistema,
              finiquito_buk : x.finiquito_buk,
              diferencia_finiquito : x.diferencia_finiquito,
              sueldo_sistema  :x.sueldo_sistema,
              sueldo_buk : x.sueldo_buk,
              diferencia_sueldo : x.diferencia_sueldo
            }
        });
        XLSX.utils.sheet_add_aoa(ws, this.headings);
        XLSX.utils.sheet_add_json(ws, excelData, { origin: 'A2', skipHeader: true });
        XLSX.utils.book_append_sheet(wb, ws, this.sheetName);

        let bo= {
          accion : 'T',
          detalle:[]
        }
        let headings=[
          [
          /* 'RUT',
          'Nombre completo', */
          'Obra',
          'Días sistema',
          'Días BUK',
          'Diferencia dias',
          'Anticipo sistema',
          'Anticipo BUK',
          'Diferencia anticipo',
          'Finiquito sistema',
          'Finiquito BUK',
          'Diferencia finiquito',
          'Sueldo sistema',
          'Sueldo BUK',
          'Diferencia sueldo',
        ]];

        this.reporteSV.get(bo).subscribe((r:any)=>{
          console.log('a comparar',r);
          let result=r.result.diferencias.map(x=>{
            return {
             /*  rut : x.rutF,
              nombreCompleto: x.nombre, */
              obra : x.obra,
              diasSistema : x.dias_sistema,
              diasBuk : x.dias_buk,
              diferencia_dias : x.diferencia_dias,
              anticipo_sistema : x.anticipo_sistema,
              anticipo_buk : x.anticipo_buk,
              diferencia_anticipo : x.diferencia_anticipo,
              finiquito_sistema : x.finiquito_sistema,
              finiquito_buk : x.finiquito_buk,
              diferencia_finiquito : x.diferencia_finiquito,
              sueldo_sistema  :x.sueldo_sistema,
              sueldo_buk : x.sueldo_buk,
              diferencia_sueldo : x.diferencia_sueldo
            }
        });
          var ws2 = XLSX.utils.json_to_sheet([]);
          XLSX.utils.sheet_add_aoa(ws2, headings);
          XLSX.utils.sheet_add_json(ws2, result, { origin: 'A2', skipHeader: true });

          XLSX.utils.book_append_sheet(wb, ws2, "DIFERENCIAS POR OBRA");
          XLSX.writeFile(wb, `${this.fileName}.xlsx`);
        })

        break;
    }




  }
}
