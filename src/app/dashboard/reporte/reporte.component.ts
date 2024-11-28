import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { FormBuilder } from '@angular/forms';
import { CellValueChangedEvent, ColDef, RowValueChangedEvent } from 'ag-grid-community';
import { DetallePagoService } from '../detalle-pago/services/detalle-pago.service';
import ChileanRutify from 'chilean-rutify';
import { AgGridAngular } from 'ag-grid-angular';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { ReporteService } from './service/reporte.service';
import { switchMap } from 'rxjs';
import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private dtSv: DetallePagoService,
    private paramSV: ParametrosService,
    private reporteSV : ReporteService,
    private aggsv: AgGridSpanishService) { }
    titlepage:string=''
  ngOnInit(): void {
    this.paramSV.get({accion:'P'}).subscribe((r:any)=>{
      console.log(r);
      //console.log('datos parametros', this.datosParametros);
      //this.datosParametros.tipo_mes =='Q' || r.result.parametros[0].tipo_mes =='I' ? this.titlepage ='QUINCENA '+r.result.parametros[0].computed : this.titlepage ='FIN DE MES '+r.result.parametros[0].computed
      this.titlepage = r.result.parametros[0].quemes;

    })
  }

  f = this.fb.group({
    file: []
  })

  columnDefs: ColDef[] = []

  dictFicha: any = {
    F1: 'badge-outline-primary',
    F2: 'badge-outline-info2',
    F3: 'badge-outline-warning2',
    F4: 'badge-outline-info',
    F5: 'badge-outline-danger2'
  }

  CurrencyCellRenderer(params: any) {

    return params.value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    //return params.value;
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
  showbtnFiniq : boolean;

  data: any = [];
  dataFiniq:any=[];

  dataGrid: any = [];
  dataGridFiniq : any=[];
  columnDefsFiniq: ColDef[] = [


  ]
  dataDiff : any=[];

  fileName:string;
  fileNameFiniq : string;
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
        ws['!ref'] = "A6:CE3000"
        let dataExcel= XLSX.utils.sheet_to_json(ws);
       // this.data = data;
       console.log('datos excel rem',dataExcel);

       dataExcel.sort(x=>x['AREA'].split(',')[2]).forEach((element:any, i:number) => {
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


        });

        this.columnDefs = [
          /* {
          headerName: 'ID',
          field: 'correlativo',
          filter: true,
          floatingFilter: true,
          editable : false,
          width: 80
        }, */
      {
        headerName: 'Nombre completo',
        field: 'nombre',
        filter: true,
        width: 200,
        floatingFilter: true,
        editable: false
      },
      {
        headerName: 'RUT',
        field: 'rut',
        filter: true,
        floatingFilter: true,
        editable: false
      },
      {
        headerName: 'Obra',
        field: 'obra',
        filter: true,
        floatingFilter: true,
        editable: false,
        width: 80,
        cellClass: params => {
          return this.dictFicha[params.value];
        }
      },

      {
        headerName: 'Días',
        field: 'dias',
        filter: true,
        width: 80,
        floatingFilter: true,
        editable: false
      },
      {
        headerName: 'Anticipo',
        field: 'anticipo',
        filter: true,
        width: 120,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },
      {
        headerName: 'Sueldo',
        field: 'sueldo',
        width: 120,
        filter: true,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },

    ]
        console.log('data REM FInal',this.data);
        let body ={
          accion : 'R',
          detalle : this.data
        }
        this.reporteSV.get(body).subscribe(r=>{
          console.log("Reporte", r);
          this.dataGrid = this.data;

          //Swal.fire(this.fileName,'Datos ingresados correctamente','success')
        });



      };
    } else {
      Swal.fire('Formato no permitido', 'Solo se admite formato .xls/.xlsx', 'warning');
      this.f.reset();
    }
  }

  handleFileInputFiniq(event:any){
    this.dataFiniq=[];
    this.fileNameFiniq='';

    const file = event.target.files[0];
    console.log(file);
    if (file.name.includes('xls')) {
      let target = event.target
      this.fileNameFiniq = file.name;

      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(target.files[0]);
      reader.onload = (e: any) => {

        const binarystr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.showbtnFiniq = true;
        ws['!ref'] = "A5:CE30000"
        let dataExcel= XLSX.utils.sheet_to_json(ws);
       // this.data = data;
       console.log('datos excel rem',dataExcel);

       dataExcel.forEach((element:any, i:number) => {
        //console.log('datos excel each',element);
        let nombre = element['Empleado - Nombre Completo'];
      /*   let apepat = element['Apellido'];
        let apemat = element['Segundo Apellido']; */
        let rut = element['Empleado - Número de Documento'];
        let ficha = element['Empleado - Código de Ficha'];
        let area = element['Trabajo - Nombre Sub-área Asignada(o)'] ;
        let montoSinRemunerar = element['Finiquito - Monto sin remuneración pendiente'];
       // let finiq = 'F';


          this.dataFiniq.push({
            nombre: nombre,
            rut: rut,
            ficha: ficha,
            obra: '0'+area.trim().split(/\s+/)[0],
            montoSinRemunerar: montoSinRemunerar=='' ? 0:montoSinRemunerar,
            //finiq : finiq,
          })

        });
        this.columnDefsFiniq = [
          /* {
          headerName: 'ID',
          field: 'correlativo',
          filter: true,
          floatingFilter: true,
          editable : false,
          width: 80
        }, */
      {
        headerName: 'Nombre completo',
        field: 'nombre',
        filter: true,
        width: 200,
        floatingFilter: true,
        editable: false
      },
      {
        headerName: 'RUT',
        field: 'rut',
        filter: true,
        width: 150,
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
        headerName: 'Obra',
        field: 'obra',
        filter: true,
        width: 90,
        floatingFilter: true,
        editable: false
      },
      {
        headerName: 'Monto sin remunerar',
        field: 'montoSinRemunerar',
        filter: true,
        width: 120,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },
      ]
        console.log('data finiq FInal',this.dataFiniq);
        let body ={
          accion : 'F',
          detalle : this.dataFiniq
        }
        this.reporteSV.get(body).subscribe(r=>{
          console.log("Reporte", r);
          this.dataGridFiniq = this.dataFiniq.sort(x=>x.obra);

          //Swal.fire(this.fileNameFiniq,'Datos ingresados correctamente','success')
        });
      };
    } else {
      Swal.fire('Formato no permitido', 'Solo se admite formato .xls/.xlsx', 'warning');
      this.f.reset();
    }
  }

  resultadosComparados =[];
  columnDefsComparados = [];
  resultadosComparadosBUK = [];
  columnDefsComparadosBUK =[];
  comparar(){
    this.resultadosComparados=[];
    this.resultadosComparadosBUK = [];
    let body = {
      accion : 'C',
      detalle:[]
    }

    this.reporteSV.get(body).pipe(
      switchMap((r:any)=>{
        this.resultadosComparados = r.result.diferencias.map(x=>{
          return {
            ...x,
            rutF : x.rut+'-'+x.dig,

          }
        });
        this.columnDefsComparados = [
      {
        headerName: 'RUT',
        field: 'rutF',
        filter: true,
        width: 150,
        floatingFilter: true,
        editable: false
      },
      {
        headerName: 'Nombre completo',
        field: 'nombre',
        filter: true,
        width: 200,
        floatingFilter: true,
        editable: false
      },
      {
        headerName: 'Obra',
        field: 'obra',
        filter: true,
        width: 95,
        floatingFilter: true,
        editable: false
      },

      {
        headerName: 'Dias sistema',
        field: 'dias_sistema',
        filter: true,
        width: 120,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },

      {
        headerName: 'Dias BUK',
        field: 'dias_buk',
        filter: true,
        width: 120,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },
      {
        headerName: 'Diferencia dias',
        field: 'diferencia_dias',
        filter: true,
        width: 120,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },
      {
        headerName: 'Anticipo sistema',
        field: 'anticipo_sistema',
        filter: true,
        width: 100,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },
      {
        headerName: 'Anticipo BUK',
        field: 'anticipo_buk',
        filter: true,
        width: 100,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },
      {
        headerName: 'Diferencia anticipo',
        field: 'diferencia_anticipo',
        filter: true,
        width: 120,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },
      {
        headerName: 'Finiquito sistema',
        field: 'finiquito_sistema',
        filter: true,
        width: 120,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },
      {
        headerName: 'Finiquito BUK',
        field: 'finiquito_buk',
        filter: true,
        width: 100,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },

      {
        headerName: 'Diferencia finiquito',
        field: 'diferencia_finiquito',
        filter: true,
        width: 120,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },
      {
        headerName: 'Sueldo sistema',
        field: 'sueldo_sistema',
        filter: true,
        width: 120,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      },
      {
        headerName: 'Sueldo BUK',
        field: 'sueldo_buk',
        filter: true,
        width: 100,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      }
      ,
      {
        headerName: 'Diferencia sueldo',
        field: 'diferencia_sueldo',
        filter: true,
        width: 120,
          floatingFilter: true,
        editable: false,
        cellRenderer: this.CurrencyCellRenderer
      }
      ,
      {
        headerName: 'Observaciones',
        field: 'observaciones',
        filter: true,
        width: 150,
        floatingFilter: false,
        editable: true,
        lockPinned: true,
        pinned: 'right',
        cellEditor: 'agLargeTextCellEditor',
          cellEditorPopup: true,
          cellEditorParams: {
              maxLength: 100,
              rows: 15,
              cols: 50
          }
      }
      ]
      let bo= {
        accion : 'T',
        detalle:[]
      }

      return this.reporteSV.get(bo);
      })
    ).subscribe((r:any)=>{
      console.log('DATOS COMPARADOS BUK',r);
      this.columnDefsComparadosBUK = [
        {
          headerName: 'Obra',
          field: 'obra',
          filter: true,
          width: 100,
          floatingFilter: true,
          editable: false
        },
        {
          headerName: 'Días sistema',
          field: 'diasSistema',
          filter: true,
          width: 100,
          floatingFilter: true,
          editable: false,
          cellRenderer: this.CurrencyCellRenderer
        },
        {
          headerName: 'Diferencia días',
          field: 'diferencia_dias',
          filter: true,
          width: 100,
          floatingFilter: true,
          editable: false,
          cellRenderer: this.CurrencyCellRenderer
        },
        {
          headerName: 'Anticipo Sistema',
          field: 'anticipo_sistema',
          filter: true,
          floatingFilter: true,
          editable: false,
          cellRenderer: this.CurrencyCellRenderer
        },
        {
          headerName: 'Anticipo BUK',
          field: 'anticipo_buk',
          filter: true,
          floatingFilter: true,
          editable: false,
          cellRenderer: this.CurrencyCellRenderer
        },
        {
          headerName: 'Diferencia anticipo',
          field: 'diferencia_anticipo',
          filter: true,
          floatingFilter: true,
          editable: false,
          cellRenderer: this.CurrencyCellRenderer
        },
        {
          headerName: 'Finiquito sistema',
          field: 'finiquito_sistema',
          filter: true,
          floatingFilter: true,
          editable: false,
          cellRenderer: this.CurrencyCellRenderer
        },
        {
          headerName: 'Finiquito BUK',
          field: 'finiquito_buk',
          filter: true,
          floatingFilter: true,
          editable: false,
          cellRenderer: this.CurrencyCellRenderer
        },
        {
          headerName: 'Diferencia finiquito',
          field: 'diferencia_finiquito',
          filter: true,
          floatingFilter: true,
          editable: false,
          cellRenderer: this.CurrencyCellRenderer
        },
        {
          headerName: 'Sueldo sistema',
          field: 'sueldo_sistema',
          filter: true,
          floatingFilter: true,
          editable: false,
          cellRenderer: this.CurrencyCellRenderer
        },
        {
          headerName: 'Sueldo BUK',
          field: 'sueldo_buk',
          filter: true,
          floatingFilter: true,
          editable: false,
          cellRenderer: this.CurrencyCellRenderer
        },
        {
          headerName: 'Diferencia sueldo',
          field: 'diferencia_sueldo',
          filter: true,
          floatingFilter: true,
          editable: false,
          cellRenderer: this.CurrencyCellRenderer
        },
        {
          headerName: 'Observaciones',
          field: 'observaciones',
          filter: true,
          width: 200,
          floatingFilter: false,
          editable: true,
          lockPinned: true,
          pinned: 'right',
          cellEditor: 'agLargeTextCellEditor',
            cellEditorPopup: true,
            cellEditorParams: {
                maxLength: 100,
                rows: 15,
                cols: 50
            }
        }
      ]


      this.resultadosComparadosBUK=r.result.diferencias.map(x=>{
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
          diferencia_sueldo : x.diferencia_sueldo,
          observaciones : x.observaciones ? x.observaciones : ''
        }


    });
    this.currentStep++;

    })


  }


  headings=[
    [
    'RUT',
    'Nombre completo',
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
    'Observaciones'
  ]
]


currentStep: number = 1;

nextStep() {
  if (this.currentStep < 3) {
    this.currentStep++;
  }
}

prevStep() {
  if (this.currentStep > 1) {
    this.currentStep--;
  }
}




}
