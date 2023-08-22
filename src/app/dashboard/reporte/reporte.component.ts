import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { FormBuilder } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { DetallePagoService } from '../detalle-pago/services/detalle-pago.service';
import ChileanRutify from 'chilean-rutify';
import { AgGridAngular } from 'ag-grid-angular';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private dtSv: DetallePagoService,private paramSV: ParametrosService,) { }
    titlepage:string=''
  ngOnInit(): void {
    this.paramSV.get({accion:'C'}).subscribe((r:any)=>{
      console.log(r);
      r.result.parametros[0].tipo_mes =='Q' || r.result.parametros[0].tipo_mes =='I' ? this.titlepage ='quincena '+r.result.parametros[0].computed : this.titlepage ='fin de mes '+r.result.parametros[0].computed

    })
  }

  f = this.fb.group({
    file: []
  })

  columnDefs: ColDef[] = [
      {
        headerName: 'ID',
        field: 'correlativo',
        filter: true,
        floatingFilter: true,
        editable : false,
        width: 80
      },
    {
      headerName: 'Nombre completo',
      field: 'nombre',
      filter: true,
      floatingFilter: true,
      editable: false
    },
    {
      headerName: 'Ficha',
      field: 'ficha',
      filter: true,
      floatingFilter: true,
      editable: false,
      width: 80,
      cellClass: params => {
        return this.dictFicha[params.value];
      }
    },
    {
      headerName: 'RUT',
      field: 'rut',
      filter: true,
      floatingFilter: true,
      editable: false
    },
    {
      headerName: 'Especialidad',
      field: 'cargo',
      filter: true,
      floatingFilter: true,
      editable: false
    },
    {
      headerName: 'Monto libro remuneraciones',
      field: 'sueldo',
      filter: true,
        floatingFilter: true,
      editable: false,
      cellRenderer: this.CurrencyCellRenderer
    },

  ]

  dictFicha: any = {
    F1: 'badge-outline-primary',
    F2: 'badge-outline-info2',
    F3: 'badge-outline-warning2',
    F4: 'badge-outline-info',
    F5: 'badge-outline-danger2'
  }

  CurrencyCellRenderer(params: any) {

    var usdFormate = new Intl.NumberFormat();
    return usdFormate.format(params.value);
  }

  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  dataPagos: any = [];

  @ViewChild('dtGrid') grid!: AgGridAngular;

  getPagos() {
    let body = {
      tipo: 'pagos',
      obra: this.obra.codigo,
      accion: 'C'
    }
    this.dtSv.get(body).subscribe((r: any) => {
      // this.data = r.result.pagos;
      let c = 0;
      this.dataPagos = r.result.pagos.map(x => {
        c++;
        return {
          ...x,
          correlativo: c,
          rutF: ChileanRutify.formatRut(`${x.rut}-${x.dig}`)
        }
      });
      console.log('datos del excel', this.data); //este arma la grilla hay q pushearle el dato del monto web
      console.log('pagos', this.dataPagos);
      let auxData = [];

      this.data.forEach(exl => {

        this.dataPagos.forEach(ePagos => {
          if (ePagos.rutF == exl.rut && ePagos.ficha == exl.ficha) {
            let diferencia = Math.abs(ePagos.liq_apagar - exl.sueldo);
            auxData.push({
              ...exl,
              montoWeb: ePagos.liq_apagar,
              diferencia: diferencia
            });

            /* exl['montoWeb'] == ePagos.liq_apagar;
            if(ePagos.liq_apagar != exl.sueldoLiq ){
              //console.log('crear el excel');
              let diferencia =Math.abs(ePagos.liq_apagar - exl.sueldoLiq);

            } */
          }
        });
      });

      console.log(this.dataDiff)

      this.dataGrid = auxData;
      console.log('datos del excel formated', this.dataGrid);

      this.columnDefs.push({
        headerName: 'Monto sistema web',
        field: 'montoWeb',
        filter: true,
        floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },
        {
          headerName: 'Diferencia',
          field: 'diferencia',
          filter: false,
          floatingFilter: false,
          editable: false,
          cellRenderer: this.CurrencyCellRenderer
        });
      //this.grid.api.sizeColumnsToFit();
      //this.loading = false;
      //this.grid.api.setRowData(this.data);
      //this.pinnedBottomRowData = this.createPinnedData(this.data)
    })
  }

  exportexc() {
    const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataGrid);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Datos');

    const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
    const dataBlob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(dataBlob, `Reporte_comparacion_${this.obra.codigo}-${this.obra.nombre}.xlsx`);
  }


  showbtn: boolean;
  data: any = [];
  dataGrid: any = [];
  dataDiff : any=[];
  fileName:string;
  handleFileInput(event: any): void {
    const file = event.target.files[0];
    this.fileName = file.name;
    console.log(file);
    if (file.name.includes('xls')) {
      this.showbtn = true;

      let target = event.target
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(target.files[0]);
      reader.onload = (e: any) => {

        const binarystr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        console.log(ws)

        const data = XLSX.utils.sheet_to_json(ws, { header: 0, raw: false, blankrows: false });

        console.log(data);
        data.forEach((element, i) => {
          let sueldoLiq = element['SUELDO LÍQUIDO'];
          let rut = element['RUT'];
          let ficha = element['CÓDIGO'];
          let nombre = `${element['AP PATERNO']} ${element['AP MATERNO']} ${element['NOMBRES']}`;
          let cargo = element['CARGO'];
          //console.log('comprar este valor',rut,ficha,sueldoLiq)
          if (ficha != '-') {
            this.data.push({
              correlativo: i + 1,
              nombre: nombre,
              rut: rut,
              ficha: ficha,
              sueldo: parseFloat(sueldoLiq.replace(/,/g, '')),
              cargo: cargo
            })
          }

        });

        this.getPagos()

        //console.log('dataformat del excel',this.data)


      };
    } else {
      Swal.fire('Formato no permitido', 'Solo se admite formato .xls/.xlsx', 'warning');
      this.f.reset();
    }
  }


}
