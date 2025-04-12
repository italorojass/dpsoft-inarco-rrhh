import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';

@Component({
  selector: 'app-importarBuilder',
  templateUrl: './importarBuilder.component.html',
  styleUrls: ['./importarBuilder.component.css']
})
export class ImportarBuilderComponent implements OnInit {

  constructor(public ParametrosService: ParametrosService, private toastr: ToastrService) { }
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);

  ngOnInit() {
  }
  fileName: string = '';
  data: any = [];
  showbtn: boolean = false;
  handleFileInput(event: any): void {
    this.fileName = '';
    this.data = [];
    const file = event.target.files[0];

    const sessionPeriodo = JSON.parse(sessionStorage.getItem('periodoAbiertoAUX')!);


    const fechaInicio = sessionPeriodo.inicio_periodo.split('/').map(Number);
    const fechaFin = sessionPeriodo.final_periodo.split('/').map(Number);

    const fechaInicioParams = new Date(fechaInicio[2], fechaInicio[1] - 1, fechaInicio[0]);
    const fechaFinParams = new Date(fechaFin[2], fechaFin[1] - 1, fechaFin[0]);

    console.log('fechaInicioParams', fechaInicioParams.toLocaleDateString());
    console.log('fechaFinParams', fechaFinParams.toLocaleDateString());

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
        ws['!ref'] = ws['!ref'] || "A1:CE10000"; // Tomar todo el excel
        let dataExcel = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const aux = [];
        dataExcel.forEach((element: any, i: number) => {
          if (element[i] != 'N' && !element[i]) {
            aux.push(element);
          }
        });
        console.log('datos excel rem aux', aux);
        const dataFilter = aux.filter((item: any) =>
          item[34] != 0 && item[34] != '' && item[34] != null
        );
        console.log('dataFilter', dataFilter);
        const columnRutData = dataFilter.map(row => row[9]); // Obtener datos de la columna C
        const fecha = dataFilter.map(row => row[1]);

        const hora_extra = dataFilter.map(row => row[34]);
        this.data.push({
          rut: columnRutData,
          fecha: fecha,
          hora_extra: hora_extra,
          obra: this.obra.codigo
        })

        console.log('datos excel formated', this.data);

        const fechaInicioExcelFormated = new Date(this.data[0].fecha[0]);

        const fechaFinExcelFormated = new Date(this.data[this.data.length - 1].fecha[this.data[this.data.length - 1].fecha.length - 1]);

        console.log('fechaInicioExcelFormated', fechaInicioExcelFormated.toLocaleDateString());
        console.log('fechaFinExcelFormated', fechaFinExcelFormated.toLocaleDateString());

        if(fechaInicioExcelFormated >= fechaInicioParams && fechaFinExcelFormated <= fechaFinParams){
        //  this.toastr.info('Dentro del rango deperiodo');
            this.ParametrosService.postImportarBuilder(this.data[0]).subscribe((r:any)=>{
          console.log('response importar builder',r);
          this.toastr.success('Datos importados correctamente');
          this.data = [];
        })

        }else{
          this.toastr.error('Los periodos del archivo no coinciden con el periodo actual');
        }




      }
    }


  }

}
