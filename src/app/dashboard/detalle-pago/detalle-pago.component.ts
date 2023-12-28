import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DetallePagoService } from './services/detalle-pago.service';
import { ToastrService } from 'ngx-toastr';
import ChileanRutify from 'chilean-rutify';
import { ColDef, ICellEditorParams, RowClassRules, RowValueChangedEvent } from 'ag-grid-community';
import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ProyectosService } from 'src/app/shared/components/proyectos/services/proyectos.service';

import { CurrencyPipe } from '@angular/common';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { BtnEliminarDetallePagoComponent } from 'src/app/shared/components/btn-eliminar-detalle-pago/btn-eliminar-detalle-pago.component';
import { EliminarPagoService } from 'src/app/shared/components/btn-eliminar-detalle-pago/service/eliminar-pago.service';
import { validateRut } from '@fdograph/rut-utilities';
import { NavigationEnd, Router } from '@angular/router';
import { PeriodosService } from 'src/app/shared/services/periodos.service';

@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.css']
})
export class DetallePagoComponent implements OnInit {
  //mostrar liquido a pagar
  //en  pop up finiquito fin de mes va a validar contra el sueldo liquido
  //el resto se calcula en base a remuneracion a pagar

  totalPeriodoEdit: any;
  totalRemuneracionEdit: any;
  totalDesctEdit: any;

  numbers: any;
  constructor(private fb: FormBuilder,
    private dtSv: DetallePagoService,
    private toastr: ToastrService,
    private ps: ProyectosService,
    private aggsv: AgGridSpanishService,
    private BuildMonthService: BuildMonthService,
    private currencyPipe: CurrencyPipe,
    private deletePago: EliminarPagoService,
    public ParametrosService: ParametrosService,
    private router: Router,
    private periodos : PeriodosService) {

    // subscribe to the router events. Store the subscription so we can
    // unsubscribe later.
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initData();
      }
    });
  }

  initData() {
    if (this.deletePago.dataEdit) {
      this.deletePago.dataEdit.subscribe((valueEdit: any) => {

        let format = {
          accion: 'E',
          id_detalle: valueEdit.id,
          tipo: 'pagos',
          obra: this.obra.codigo,
        }
        console.log('click edit ', format);
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
          title: 'Estás eliminando un trabajador!',
          text: `Estas seguro de eliminar al trabajador ${valueEdit.nombre} de manera permanente de la obra ${this.obra.nombre}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, Eliminar',
          cancelButtonText: 'No, cancelar',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.deletePago.deleteTrabajador(format).subscribe(r => {
              console.log('click edit response ', r);
              this.toastr.success('Eliminado', `Trabajador ${valueEdit.nombre} eliminado del sistema`);
              this.getPagos()
              result.dismiss === Swal.DismissReason.cancel
            })


          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            /* swalWithBootstrapButtons.fire(
              'Cancelled',
              'Your imaginary file is safe :)',
              'error'
            ) */
          }
        })

        //this.getObras(valueEdit)
      })
    }
    this.getParametros();
    this.getEspecialidad();

    this.getPagos();
  }

  getParametros(){


    this.datosParametros = JSON.parse(sessionStorage.getItem('datosParam'));
    this.titlepage = sessionStorage.getItem('titlePage');

  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  titlepage = '';
  dictFicha: any = {
    F1: 'badge-outline-primary',
    F2: 'badge-outline-info2',
    F3: 'badge-outline-warning2',
    F4: 'badge-outline-info',
    F5: 'badge-outline-danger2'
  }
  datosParametros: any;
  navigationSubscription: any;


  ngOnInit() {
    this.initData();
    this.numbers = Array.from(Array(20).keys())
    this.editPagoForm.controls['rut'].valueChanges.subscribe(value => {
      let dig = ChileanRutify.getRutVerifier(value);
      this.editPagoForm.controls['dig'].patchValue(dig);

    })

  }



  especialidades = [];
  getEspecialidad() {
    let b = {
      tipo: 'pagos',
      obra: this.obra.codigo
    }
    this.ps.get(b).subscribe((data: any) => {
      console.log('response especialidades', data);
      this.especialidades = data['result']
    });
  }

  cellCellEditorParams = (params: ICellEditorParams<any>) => {
    //
    const selectedCountry = params.data.id;
    console.log('SELECTED', selectedCountry);
    let keys = this.especialidades.map(x => {
      return x.descripcion
    });

    return {
      values: keys,
      formatValue: (value) => `${value} (${selectedCountry})`,
    };
  };

  getChanges(e) {
    console.log('este cambiar', e);
    let indexEspecialidad = this.especialidades.find(x => x.descripcion == e.descripcion);
    console.log('especialidad id', indexEspecialidad);

    let body1 = {
      tipo: "pagos",
      accion: "M",
      especialidad: indexEspecialidad.id,
      sueldo_liq: Number(e.sueldo_liq),
      id_detalle: e.id,
      obra: this.obra.codigo,
      dias: parseFloat(e.dias),
      valor_hora: Number(e.valor_hora),
      ajuste_pos: Number(e.ajuste_pos),
      anticipo: Number(e.anticipo),
      dctos_varios: Number(e.dctos_varios),

      finiq: e.finiq,
      zona10: Number(e.zona10),
      viatico: Number(e.viatico),
      asignaciones: Number(e.asignaciones),
      aguinaldo: Number(e.aguinaldo),
      finiquito: Number(e.finiquito),
      finiquito_findemes: Number(e.finiquito_findemes)
    }
    console.log('body edit', body1);
    this.dtSv.get(body1).subscribe(r => {
      this.toastr.success('Actualizado con éxito', `Pago trabajador ${e.nombre}`);
      this.getPagos();

    })

  }
  formatRut(rut, dig) {

    return this.BuildMonthService.formatRut(rut, dig);
  }

  data = [];
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  searchTerm: string;
  page = 1;
  pageSize = 4;
  collectionSize: number;
  getPagos() {
    let body = {
      tipo: 'pagos',
      obra: this.obra.codigo,
      accion: 'C',
      quemes : this.datosParametros.quemes
    }
    this.data=[];
    this.dtSv.get(body).subscribe((r: any) => {
      // this.data = r.result.pagos;
      console.log(r)
      let c = 0;
      if (r.result.pagos) {
        this.collectionSize = r.result.pagos.length;
        this.data = r.result.pagos.map(x => {
          c++;

          return {
            ...x,
            correlativo: c,
            rutF: ChileanRutify.formatRut(`${x.rut}-${x.dig}`)
          }
        });
        //this.loading = false;
        this.grid.api.setRowData(this.data);

        let result = [{}];
        let calcTotalCols = [
          'sueldo_liq',
          'valor_hora',
          'total_periodo',

          'val_lun_sab',
          'difer_sabado',
          'difer_domingo',
          'total_bonos',
          'zona10',
          'viatico',
          'aguinaldo',
          'asignaciones',
          'ajuste_pos',
          'total_ganado',
          'anticipo',
          'dctos_varios',
          'a_pagar',
          'finiquito',
          'finiquito_findemes',
          'liq_apagar'
        ];
        // initialize all total columns to zero
        calcTotalCols.forEach((params) => {
          result[0][params] = 0
        });
        // calculate all total columns
        calcTotalCols.forEach((params) => {
          this.data.forEach((line) => {
            result[0][params] += line[params];
          });
        });



        this.grid.api.setPinnedBottomRowData(result);
        this.grid.api.getDisplayedRowCount();
        this.grid.defaultColDef.editable = (o) => !o.node.isRowPinned();
      } else {

      }

      //this.pinnedBottomRowData = this.createPinnedData(this.data)
    })
  }


  rowClassRules: RowClassRules = {
    // row style function
    'sick-days-warning': (params) => {

      return params.data.ciequincena === 'S';
    },
    // row style expression

  };


  @ViewChild('pdfTable') pdfTable: ElementRef;
  createPDF(action = 'open') {

    this.dtSv.crearPDF({ obra: this.obra.codigo }).subscribe(r => {
      let tableHeader = [
        { text: 'N°', alignment: 'center', margin: [0, 10] },
        { text: 'Finiq.', alignment: 'center', margin: [0, 10] },
        { text: 'Nombre completo', bold: true, alignment: 'center', margin: [0, 10] },
        //{text:'N° de ficha',alignment: 'center',margin: [0, 10]},
        { text: 'Rut', alignment: 'center', margin: [0, 10] },
        { text: 'Sueldo líquido', alignment: 'center', margin: [0, 10] },
        //{text:'Especialidad',alignment: 'center',margin: [0, 10]},
        { text: 'Dias a pago', alignment: 'center', margin: [0, 10] },
        { text: 'Valor hora extra líquido', alignment: 'center', margin: [0, 10] },
        { text: 'Total periodo', alignment: 'center', margin: [0, 10] },
        { text: 'Horas extras legal lunes a sábado', alignment: 'center', margin: [0, 10] },

        { text: 'Total valor hora líquido', alignment: 'center', margin: [0, 10] },
        { text: 'Diferencia días sábado', alignment: 'center', margin: [0, 10] },
        { text: 'Diferencia días domingo', alignment: 'center', margin: [0, 10] },
        { text: 'TOTAL BONOS', alignment: 'center', margin: [0, 10] },
        { text: 'Asignaciones', alignment: 'center', margin: [0, 10] },
        { text: 'Total ganado', alignment: 'center', margin: [0, 10] },
        { text: 'Anticipo', alignment: 'center', margin: [0, 10] },
        { text: 'Descuentos varios', alignment: 'center', margin: [0, 10] },
        { text: 'Remuneración a pagar', alignment: 'center', margin: [0, 10] },
        { text: 'Finiquito Quincena', alignment: 'center', margin: [0, 10] },
        { text: 'Finiquito fin de mes', alignment: 'center', margin: [0, 10] },
        { text: 'Líquido a pagar', alignment: 'center', margin: [0, 10] }
      ]
      console.log(r);
      //r['result'].datos
      let bodyTable = r['result'].datos.map((p, i) => {

        return [
          i + 1,
          { text: p.finiq, alignment: 'left' },
          { text: p.nombre, alignment: 'left' },
          //{text : p.ficha,alignment: 'center'},
          { text: `${p.rut}/${p.ficha}`, alignment: 'left' },
          { text: p.sueldo_liq.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          //{text : p.descripcion,alignment: 'center'},
          { text: Number(p.dias), alignment: 'right' },
          { text: p.valor_hora.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: p.total_periodo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: Number(p.hor_lun_sab).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: Number(p.val_lun_sab).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: p.difer_sabado.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: p.difer_domingo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: p.total_bonos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: p.asignaciones.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: p.total_ganado.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: p.anticipo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: p.dctos_varios.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: p.a_pagar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: p.finiquito.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: p.finiquito_findemes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
          { text: p.liq_apagar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },

        ]
      });

      let today = new Date().toLocaleString();
      console.log(bodyTable)

      let docDefinition = {
        footer: function (currentPage, pageCount, pageSize) {
          // you can apply any logic and return any valid pdfmake element
          return [{ text: 'Página ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center', margin: [0, 5] }];

        },
        header: function (currentPage, pageCount, pageSize) {
          // you can apply any logic and return any valid pdfmake element
          return [{ text: 'Página ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center', margin: [0, 20] }];

        },
        pageBreak: 'after',
        pageOrientation: 'landscape',
        pageSize: 'A2',
        pageMargins: [40, 60, 40, 60],
        info: {
          title: 'Reporte detalle pagos',

        },
        //watermark: { text: 'test watermark', color: 'blue', opacity: 0.3, bold: true, italics: false },
        content: [
          // Previous configuration
          {
            text: 'REPORTE DETALLE PAGOS ' + this.titlepage,
            fontSize: 16,
            alignment: 'center',
            bold: true,
            style: 'header',
            margin: [0, 10]
          },
          {
            columns: [
              {
                width: 300,
                text: `Obra: ${this.obra.codigo} | ${this.obra.nombre}`, margin: [0, 10]
              },

              {
                width: '*',
                text: 'Fecha: ' + today.split('T'),
                alignment: 'right',
                margin: [0, 10]
              },
            ]
          },

          {
            table: {
              headerRows: 1,

              widths: [
                25,//numero
                15,//finiq
                200,//nombre
                //'*',//ficha
                100,//rut
                'auto',//sueldo liquido
                //200,//especialidad
                'auto',//Dias a pago
                'auto',//valor hora extra
                'auto',//Total periodo
                'auto',//Horas extras legal lunes a sábado
                'auto',//Total valor hora líquido
                'auto',//Diferencia de días sábado
                'auto', //diferencia dia domingo
                'auto',//TOTAL BONOS
                'auto',//Asignaciones
                'auto',//Total ganado
                'auto',//Anticipo
                'auto',//Descuentos varios
                'auto',//Remuneración
                'auto',//Finiquito Quincena
                'auto',//Finiquito fin de mes
                'auto'//liquido a pagar

              ],

              body: [
                tableHeader, ...bodyTable,
                [
                  {},
                  {},
                  {},
                  { text: 'TOTALES', colspan: 3, bold: true, alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.sueldo_liq, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + Number(p.dias), 0), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.valor_hora, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.total_periodo, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + Number(p.hor_lun_sab), 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.val_lun_sab, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.difer_sabado, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.difer_domingo, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.total_bonos, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.asignaciones, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.total_ganado, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.anticipo, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.dctos_varios, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.a_pagar, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.finiquito, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.reduce((sum, p) => sum + p.finiquito_findemes, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
                  { text: r['result'].datos.filter(f => f.liq_apagar > 0).reduce((sum, p) => sum + p.liq_apagar, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' }

                ]
              ],
              alignment: 'center'


            },
          },
          {
            columns: [

              {
                width: 650,
                text: 'V°B° Admnistrador de obra',
                alignment: 'center',
                margin: [0, 100],
                decoration: 'overline'
              },
              {
                width: 780,
                text: 'V°B° Visitador de obra',
                alignment: 'right',
                margin: [20, 100],
                decoration: 'overline',

              },
            ]
          },

        ],
        styles: {
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15],
            alignment: 'center'

          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black',
            alignment: 'center'
          },
          anotherStyle: {
            italics: true,
            alignment: 'center'
          }
        }

      }

      if (action === 'download') {
        pdfMake.createPdf(docDefinition).download('Reporte_DetallePagos_' + this.obra.codigo + '_' + this.obra.nombre + '_' + this.titlepage + '.pdf');
      } else if (action === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition, { filename: 'Reporte_DetallePagos_' + this.obra.codigo + '_' + this.obra.nombre + '_' + this.titlepage + '.pdf' }).open();
      }
    })



    /*  let r['result'].datos =  this.data.filter(v=>{
      // v.ciequincena != 'S' && v.finiq == 'F'
      if(this.datosParametros.tipo_mes =='Q'){
       return v.finiq == 'Q';
      }else{
       return v.finiq  != 'F' && v.ciequincena == 'Q' || v.ciequincena;
      }

     }); */






  }

  headings = [
    [
      'Finiq',
      'Nombre',
      'RUT',
      'Ficha',
      'Especialidad',
      'Sueldo líquido',
      'Días a pago',
      'Valor hora extra líquido',
      'Total periodo',
      'Hora extra legal Lunes a Sábado',
      'Total valor hora extra líquido',
      'Diferencia días Sábados',
      'Diferencia días Domingo',
      'Total bonos',
      'Zona 10%',
      'Viático',
      'Aguinaldo',
      'Asignaciones',
      'Ajuste positivo',
      'Total ganado',
      'Anticipos',
      'Descuentos varios',
      'Remuneración a pagar',
      'Finiq quincena',
      'Finiq fin de mes',
      'Líquido a pagar',


    ],
  ];

  datosExcel = [];
  showbtn: boolean;
  handleFileInput(event: any): void {
    const file = event.target.files[0];
    this.datosExcel = [];
    //this.fileName = file.name;
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
        if (data.length > 0) {
          data.forEach((element, i) => {
            let sueldoLiq = element['Sueldo Liquido*'];
            let rut = element['Empleado*'].split('-');
            let ficha = element['Código de Ficha'];
            let nombre = `${element['Nombre ']} `;
            let especialidad = element['Especialidad*'];
            //console.log('comprar este valor',rut,ficha,sueldoLiq)
            this.datosExcel.push({
              nombre: nombre,
              rut: rut[0],
              dig: rut[1],
              ficha: ficha,
              sueldo_liq: Number(sueldoLiq),
              especialidad: especialidad,
              obra: this.obra.codigo
            })
          });
        }

        console.log('dataformat del excel', this.datosExcel)

        this.cargaMasivaSend();
      };
    } else {
      Swal.fire('Formato no permitido', 'Solo se admite formato .xls/.xlsx', 'warning');
      //this.f.reset();
    }
  }

  cargaMasivaSend() {
    this.dtSv.cargaMasiva(this.datosExcel).subscribe(r => {
      this.toastr.success('Carga masiva', 'Trabajadores agregados correctamente');
      this.closeModal.nativeElement.click() //<-- here
      this.getPagos();
      this.datosExcel = [];
    })
  }

  @ViewChild('dtGrid') grid!: AgGridAngular;
  defaultColDef: ColDef = {
    resizable: true,
    initialWidth: 200,

    sortable: true,
    filter: true,
    floatingFilter: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,


  };
  rowSelection = this.aggsv.rowSelection;
  overlayLoadingTemplate = this.aggsv.overlayLoadingTemplate;
  overlayNoRowsTemplate = this.aggsv.overlayNoRowsTemplate;
  localeText = this.aggsv.getLocale();

  columnDefs: ColDef[] = [

    {
      headerName: 'Acciones',
      cellRenderer: BtnEliminarDetallePagoComponent,
      cellRendererParams: {
        clicked: (field: any) => {
          console.log('item click', field);
        }
      },
      filter: false,
      floatingFilter: false,
      lockPinned: true,
      pinned: 'left',
      width: 100,
      autoHeight: true,
      editable: false,
      suppressSizeToFit: true,
    },
    {
      field: 'finiq',
      headerName: 'Finiq.',
      width: 100,
      sortable: true,
      lockPinned: true,
      pinned: 'left',
      //cellRenderer: this.CurrencyCellRenderer,
      editable: (params) => (params.data.ciequincena !== 'S' || this.datosParametros.estado =='A'),
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 250,
      suppressSizeToFit: true,
      pinned: 'left',
      lockPinned: true,
      cellClass: 'lock-pinned',

      editable: false
    },
    {
      field: 'rutF',
      headerName: 'Rut',
      width: 140,
      sortable: true,
      pinned: 'left',
      lockPinned: true,
      cellClass: 'lock-pinned',
      editable: false
    },
    {
      field: 'ficha',
      headerName: 'Ficha',
      width: 100,
      sortable: true,
      editable: false,
      cellClass: params => {
        return this.dictFicha[params.value];
      }
    },

    {
      field: 'descripcion',
      headerName: 'Especialidad',
      width: 280,
      sortable: true,
      editable: (params) => params.data.ciequincena !== 'S',

      cellEditor: 'agSelectCellEditor',
      cellEditorParams: this.cellCellEditorParams,
      suppressMenu: true
    },
    {
      field: 'sueldo_liq',
      headerName: 'Sueldo líquido',
      filter: "agNumberColumnFilter",
      width: 150,
      sortable: true,
      cellEditorParams: {
        precision: 0,
      },
      cellRenderer: this.CurrencyCellRenderer,
      cellRendererParams: {
        currency: 'CLP'
      },
      editable: (params) => params.data.ciequincena !== 'S',
    },
    {
      field: 'dias',
      headerName:
        'Días a pago',
      width: 110,
      sortable: true,
      editable: (params) => params.data.ciequincena !== 'S',
    },
    {
      field: 'valor_hora',
      headerName: 'Valor hora extra líquido',
      width: 100,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: (params) => params.data.ciequincena !== 'S',
    },
    {
      field: 'total_periodo',
      headerName: 'Total periodo',
      width: 100,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: false
    },
    {
      field: 'hor_lun_sab',
      headerName: 'Hora extra legal lunes a sábado',
      width: 100, sortable: true,
      editable: false
    },
    {
      field: 'val_lun_sab',
      headerName: 'Total valor hora extra líquido',
      width: 180, sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: false
    },
    {
      field: 'difer_sabado',
      headerName: 'Diferencia días sábados',
      width: 150, sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: false
    },
    {
      field: 'difer_domingo',
      headerName: 'Diferencia días domingo',
      width: 150,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: false
    },
    {
      field: 'total_bonos',
      headerName: 'Total bonos',
      width: 100,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: false
    },
    {
      field: 'zona10',
      headerName: 'Zona 10%',
      width: 100,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: (params) => params.data.ciequincena !== 'S',
    },
    {
      field: 'viatico',
      headerName: 'Viático',
      width: 100,
      sortable: true,
      cellRenderer:
        this.CurrencyCellRenderer,
      editable: (params) => params.data.ciequincena !== 'S',
    },
    {
      field: 'aguinaldo',
      headerName: 'Aguinaldo',
      width: 150,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: (params) => params.data.ciequincena !== 'S',
    },
    {
      field: 'asignaciones',
      headerName: 'Asignaciones',
      width: 150,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: (params) => params.data.ciequincena !== 'S',
    },
    {
      field: 'ajuste_pos',
      headerName: 'Ajuste positivo',
      width: 150,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: (params) => params.data.ciequincena !== 'S',
    },
    {
      field: 'total_ganado',
      headerName: 'Total ganado',
      width: 150, sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: false
    },
    {
      field: 'anticipo',
      headerName: 'Anticipos',
      width: 150,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: (params) => params.data.ciequincena !== 'S',
    },
    {
      field: 'dctos_varios',
      headerName: 'Descuentos varios',
      width: 200, sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: (params) => params.data.ciequincena !== 'S',
    },

    {
      field: 'a_pagar',
      headerName: 'Remuneración a pagar',
      width: 200,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: false
    },

    {
      field: 'finiquito',
      headerName: 'Finiq. quincena',
      width: 200,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable: (params) => params.data.ciequincena !== 'S',
    },
    {
      field: 'finiquito_findemes',
      headerName: 'Finiq. fin de mes',
      width: 120,
      sortable: true,

      cellRenderer: this.CurrencyCellRenderer,
      editable: (params) => params.data.ciequincena !== 'S',
    },

    {
      field: 'liq_apagar',
      headerName: 'Líquido a pagar',
      width: 100,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      pinned: 'right',
      editable: false,
      cellStyle: params => {
        // you can use either came case or dashes, the grid converts to whats needed
        // light green
        if (params.value < 0) {
          return { backgroundColor: '#ff5e5e' }
        } else {
          return { backgroundColor: '#7ed321' };
        }
      },
    },

  ];
  gridOptions = {
    columnDefs: this.columnDefs,
    rowData: []
  };
  pinnedBottomRowData: any[];

  onRowValueChanged(event: RowValueChangedEvent) {
    var data = event.data;
    console.log('guardar', data);
    this.getChanges(data);

  }

  /*  */

  CurrencyCellRenderer(params: any) {

    var usdFormate = new Intl.NumberFormat('es-ES');
    //return usdFormate.format(params.value);

    return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }



  getBadgeFicha(ficha: any) {
    return this.dictFicha[ficha];
  }




  getTotalPeriodo(sueldoLiquido: any, diasPago: any = 30) {
    return (sueldoLiquido / 30) * diasPago;
  }



  editPagoForm = this.fb.group({
    rut: ['', [Validators.required, Validators.minLength(8)]],
    dig: [''],
    especialidad: [Validators.required],
    ficha: ['', Validators.required],
    nombre: ['', Validators.required],
    sueldo_liq: [0, Validators.required],
    dias: [0],
    valor_hora: [0, Validators.required],
    totalPeriodo: [0],
    asignaciones: [0],
    ajuste_pos: [0],
    anticipo: [0],
    dctos_varios: [0],
    finiquito: [0],
    finiq: [''],
    zona10: [0],
    viatico: [0],
    aguinaldo: [0],
    finiquito_findemes: [0],
  });



  itemEditPago: any;
  editPago(item: any) {
    console.log('edit', item);
    this.itemEditPago = item;
    this.editPagoForm.patchValue({
      ...item,
      especialidad: item.id_espec
    });

  }
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef;

  saveEditDetallePago() {
    /*   let body ={
        tipo:"pagos",
        obra : this.obra.codigo,
        accion : 'M',
        id_detalle : this.itemEditPago.id,
        ...this.editPagoForm.value
     } */

    let body1 = {
      tipo: "pagos",
      accion: "M",
      especialidad: this.editPagoForm.value.especialidad,
      sueldo_liq: this.editPagoForm.value.sueldo_liq,
      id_detalle: this.itemEditPago.id,
      obra: this.obra.codigo,
      dias: Number(this.editPagoForm.value.dias),
      valor_hora: this.editPagoForm.value.valor_hora,
      ajuste_pos: this.editPagoForm.value.ajuste_pos,
      anticipo: this.editPagoForm.value.anticipo,
      dctos_varios: this.editPagoForm.value.dctos_varios,
      finiquito: this.editPagoForm.value.finiquito,
      finiq: this.editPagoForm.value.finiq,
      zona10: this.editPagoForm.value.zona10,
      viatico: this.editPagoForm.value.viatico,
      asignaciones: this.editPagoForm.value.asignaciones,
      aguinaldo: this.editPagoForm.value.aguinaldo,
      finiquito_findemes: this.editPagoForm.value.finiquito_findemes
    }
    console.log('body edit', body1);
    this.dtSv.get(body1).subscribe(r => {
      //console.log('response edit',r);

      this.getPagos();
    })
  }

  @ViewChild('closeModal') closeModal: ElementRef;


  newPago() {
    let body = {
      tipo: "pagos",
      obra: this.obra.codigo,
      accion: 'A',
      rut: this.editPagoForm.value.rut,
      dig: this.editPagoForm.value.dig,
      nombre: this.editPagoForm.value.nombre.toUpperCase(),
      ficha: this.editPagoForm.value.ficha,
      especialidad: this.editPagoForm.value.especialidad,
      sueldo_liq: this.editPagoForm.value.sueldo_liq,
      dias: this.editPagoForm.value.dias,
      valor_hora: this.editPagoForm.value.valor_hora,
      ajuste_pos: this.editPagoForm.value.ajuste_pos,
      anticipo: this.editPagoForm.value.anticipo,
      dctos_varios: this.editPagoForm.value.dctos_varios,
      finiquito: this.editPagoForm.value.finiquito,
      zona10: this.editPagoForm.value.zona10,
      viatico: this.editPagoForm.value.viatico,
      aguinaldo: this.editPagoForm.value.aguinaldo,
      finiquito_findemes: this.editPagoForm.value.finiquito_findemes
    }
    console.log('body new', body);
    this.dtSv.get(body).subscribe(r => {
      console.log('response new', r);
      if (r['result'].pagos) {
        this.toastr.success('Trabajador creado', '');
        this.resetForm();
        this.closeModal.nativeElement.click() //<-- here
        this.getPagos();
      } else {
        this.toastr.warning(r['result'].error_msg, '')
      }


    })
  }

  resetForm() {
    this.editPagoForm.reset({
      ficha: '',
      sueldo_liq: 0,
      dias: 0,
      valor_hora: 0,
      asignaciones: 0,
      ajuste_pos: 0,
      anticipo: 0,
      viatico: 0,
      aguinaldo: 0,
      dctos_varios: 0,
      zona10: 0,
      finiquito: 0
    });
  }

  getFormat(value) {
    if (value) {
      return Number((value)).toLocaleString()

    } else
      return value
  }






}
