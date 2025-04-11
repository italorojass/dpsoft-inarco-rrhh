import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-importarBuilder',
  templateUrl: './importarBuilder.component.html',
  styleUrls: ['./importarBuilder.component.css']
})
export class ImportarBuilderComponent implements OnInit {

  constructor() { }
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);

  ngOnInit() {
  }
  fileName:string='';
  data:any=[];
  showbtn:boolean=false;
  handleFileInput(event: any): void {
    this.fileName='';
    this.data = [];
      const file = event.target.files[0];

      console.log(file);
      if (file.name.includes('xls')) {
        let target = event.target
        const reader: FileReader = new FileReader();
        reader.readAsBinaryString(target.files[0]);
        reader.onload = (e: any) => {

          const binarystr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          this.fileName = file.name;
          this.showbtn = true;
          ws['!ref'] = ws['!ref'] || "A1:CE3000"; // Tomar todo el excel
          let dataExcel = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const aux=[];
          dataExcel.forEach((element:any, i:number) => {
            if(element[i] !='N' && !element[i]){

             aux.push(element);
            }

          });
          console.log('datos excel rem aux',aux);
          const columnRutData = aux.map(row => row[9]); // Obtener datos de la columna C
          const columnFichaData = aux.map(row => row[15]);
          const columnAData = aux.map(row => row[27]);
          const columnBData = aux.map(row => row[28]);
          this.data.push({
            rut: columnRutData,
            ficha: columnFichaData || '**',
            A: columnAData || '**',
            b: columnBData || '**'
          })

         // this.data = data;



        /*  dataExcel.sort(x=>x['AREA'].split(',')[2]).forEach((element:any, i:number) => {
          //console.log('datos excel each',element);
            let sueldoLiq = element['SUELDO LÍQUIDO'];
            let rut = element['RUT'];
            let ficha = element['CÓDIGO'];
            let especialidad = element['CARGO'];
            let nombre = `${element['AP PATERNO']} ${element['AP MATERNO']} ${element['NOMBRES']}`;
            let obra = element['AREA'].split(',')[2];
            let obraFormated = String(obra).trim().split(' ')[0];
            let anticipo = element['ANTICIPO DE SUELDO'] =='' ? 0: element['ANTICIPO DE SUELDO'];
            let dias_trab = element['DÍAS TRABAJADOS'];
            if(obra){
              this.data.push({
                dias : dias_trab == '' ? 0 : dias_trab,
                sueldo: sueldoLiq  == '' ? 0 : sueldoLiq,
                anticipo : anticipo,
                rut: rut,
                nombre: nombre,
                obra : '0'+obraFormated,
                ficha : ficha,
                especialidad,

              })
            }


          }); */
          console.log('datos excel formated',this.data);
        }
      }


  }

}
