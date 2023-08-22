import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DetallePagoService } from '../detalle-pago/services/detalle-pago.service';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { DifSabDomService } from './services/dif-sab-dom.service';
import { ButtonCellRendererComponent } from 'src/app/shared/components/button-cell-renderer/button-cell-renderer.component';
import { ColDef, GridReadyEvent, RowValueChangedEvent } from 'ag-grid-community';
import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
import { AgGridAngular } from 'ag-grid-angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';

@Component({
  selector: 'app-diferencia-sab-dom',
  templateUrl: './diferencia-sab-dom.component.html',
  styleUrls: ['./diferencia-sab-dom.component.css']
})
export class DiferenciaSabDomComponent implements OnInit {

  constructor(private bm: BuildMonthService, private sb: DifSabDomService, private toast: ToastrService, private ParametrosService : ParametrosService,
    private aggsv: AgGridSpanishService) { }
    @ViewChild('heGrid') grid!: AgGridAngular;
    titlepage ='';
  ngOnInit(): void {
    this.get();
    this.ParametrosService.get({accion:'C'}).subscribe((r:any)=>{
      console.log(r);
      r.result.parametros[0].tipo_mes =='Q' || r.result.parametros[0].tipo_mes =='I' ? this.titlepage ='quincena '+r.result.parametros[0].computed : this.titlepage ='fin de mes '+r.result.parametros[0].computed

    })
  }

  data: any = [];
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  get() {
    this.data=[];
    let body = {
      tipo: 'finde',
      accion: 'C',
      obra: this.obra.codigo
    }
    let c = 0;
    this.sb.get(body).subscribe((r: any) => {
      this.data = r.result.sab_dom.map((value) => {
        c++
        return {
          ...value,
          correlativo: c
        }
      });
      console.log(this.data);
      this.buildTbl();
      this.buildHeader();
    })

  }

  sem: any = [];
  buildHeader() {
    let date = new Date();
    let semenas = this.bm.getWeeksInMonth(date.getFullYear(), date.getMonth());
    //console.log(semenas);
    this.sem = semenas;
  }

  saveEdit(item) {
    item.isEdit = false;
    let b = {
      accion: 'M',
      //obra: this.obra.codigo,
      id_detalle_pagos: item.id_pagos1,
      val_sab_med: Number(item.sab_medio_sem1),
      val_sab_ent: Number(item.sab_entero_sem1),
      val_dom_med: Number(item.dom_medio_sem1),
      val_dom_ent: Number(item.dom_entero_sem1)
    }

    console.log('body edit', b);
    this.sb.get(b).subscribe((r: any) => {
      console.log(r);

      this.toast.success('Actualizado con éxito', `Pago trabajador ${item.nombre}`,{
        timeOut: 2000,

      });
      this.get()

    })
  }

  columnDefs = [

  ];
  api: any;
  columnApi;
  onGridReady(params: GridReadyEvent<any>) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    console.log('grid on ready', params)
  }



  onRowValueChanged(event: RowValueChangedEvent) {
    var data = event.data;
    console.log(data);
    this.saveEdit(data)

  }
  buildTbl() {
    this.columnDefs=[];
    this.columnDefs.push(
      /* {
      headerName: 'Acciones',
      cellRenderer: ButtonCellRendererComponent,
      cellRendererParams: {
        clicked: (field: any) => {
          console.log('item click', field);
        }
      },
      pinned: 'left',
      filter: false,
      floatingFilter: false,
      width: 100,
      autoHeight: true
    }, */
      {
        headerName: 'ID', field: 'correlativo',
        width: 80,
        pinned: 'left',
        filter: false,
        floatingFilter: false,
        editable: false
      },
      {
        field: 'nombre',
        headerName: 'Nombre',
        width: 250,
        suppressSizeToFit: true,
        suppressStickyLabel: true,
        pinned: 'left',
        lockPinned: true,
        cellClass: 'lock-pinned',
        editable: false
      },
      {
        field: 'cargo',
        headerName: 'Cargo',
        width: 250,
        sortable: true,
        pinned: 'left',
        editable: false
      },
      {
        headerName: 'Semana 1',
        editable: true,
        children: [
          {
            headerName: 'H. extra sábado',
            field: 'h_ex_sabado_sem1',

            width: 100,
            sortable: true,
            lockPinned: false,
            editable: false
          },
          {
            field: 'valor_hora',
            headerName: 'Valor hora',
            width: 100,
            sortable: true,
            editable: false,
            cellRenderer: this.CurrencyCellRenderer, cellRendererParams: {
              currency: 'CLP'
            },
          },
          {
            field: 'total_sab_sem1',
            headerName: 'Total',
            width: 100,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer, cellRendererParams: {
              currency: 'CLP'
            },
            editable: false
          },
          {
            field: 'sab_medio_sem1',
            headerName:
              'Valor sábado 1/2 día',
            width: 110,
            sortable: true,
            editable: true,
            cellRenderer: this.CurrencyCellRenderer, cellRendererParams: {
              currency: 'CLP'
            },
          },
          {
            field: 'sab_entero_sem1',
            headerName: 'Valor día sábado',
            width: 100,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: true
          },
          {
            field: 'h_ex_domingo_sem1',
            headerName: 'H. extras domingo',
            width: 150,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: false
          },
          {
            field: 'tot_dom_sem1',
            headerName: 'Total',
            width: 100,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: false
          },
          {
            field: 'dom_medio_sem1',
            headerName: 'Valor domingo 1/2 día',
            width: 180, sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: true
          },
          {
            field: 'dom_entero_sem1',
            headerName: 'Valor día domingo',
            width: 150,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: true
          },
          {
            field: 'dif_sab_sem1',
            headerName: 'Diferencia días sábado',
            width: 180,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: false
          },
          {
            field: 'dif_dom_sem1',
            headerName: 'Diferencia día domingo',
            width: 180,
            sortable: true,
            cellRenderer: this.CurrencyCellRenderer,
            editable: false
          },
        ]
      })
    for (let i = 2; i < 6; i++) {
      this.columnDefs.push(
        {
          headerName: 'Semana ' + i,
          marryChildren: true,
          children: [
            {
              field: 'h_ex_sabado_sem' + i,
              headerName: 'H. extras Sábado ',
              width: 120,
              sortable: true,
              editable: false
            },
            {
              field: 'total_sab_sem' + i,
              headerName: 'Total',
              width: 100,
              sortable: true,
              editable: false
            },
            {
              field: 'dif_sab_sem' + i,
              headerName: 'Diferencia día sábado',
              width: 130,
              sortable: true,
              editable: false
            },
            {
              field: 'h_ex_domingo_sem' + i,
              headerName: 'H. extras domingo ',
              width: 110,
              sortable: true,
              editable: false
            },
            {
              field: 'tot_dom_sem' + i,
              headerName: 'Total',
              width: 100,
              sortable: true,
              editable: false
            },
            {
              field: 'dif_dom_sem' + i,
              headerName: 'Diferencia día domingo',
              width: 150,
              sortable: true,
              editable: false
            },
          ]

        }
      )
    }

    this.columnDefs.push({
      field: 'total_mensual_sab',
      headerName: 'Diferencia mensual sábado',
      width: 120, sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      pinned: 'right',
      lockPinned: true,
      editable: false
    },
      {
        field: 'total_mensual_dom',
        headerName: 'Diferencia mensual domingo',
        width: 120,
        sortable: true,
        cellRenderer: this.CurrencyCellRenderer,
        pinned: 'right',
        lockPinned: true,
        editable: false
      }
    )

  }

  createPDF(action = 'open'){
    let tableHeader = [
      { text: 'N°', alignment: 'right', margin: [0, 10] },
      { text: 'RUT', alignment: 'left', margin: [0, 10] },
      { text: 'AP PATERNO', alignment: 'left', margin: [0, 10] },
      { text: 'AP MATERNO', alignment: 'left', margin: [0, 10] },
      { text: 'NOMBRES', alignment: 'left', margin: [0, 10] },
      { text: 'CARGO', alignment: 'left', margin: [0, 10] },
      { text: 'DÍAS TRABAJADOS', alignment: 'right', margin: [0, 10] },
      { text: 'ASIG. ESPECIAL', alignment: 'right', margin: [0, 10] },
      { text: 'ANTICIPO DE SUELDO', alignment: 'right', margin: [0, 10] },
      { text: 'SUELDO LÍQUIDO', alignment: 'right', margin: [0, 10] }
    ]
    let objreport = Object.assign([], this.data);
    let newob = objreport.filter(x => x.total_bonos > 0)
    let bodyTable = newob.map((p, i) => {

      return [
        { text: i+1, alignment: 'right' },
        { text: p.nombre, alignment: 'center' },
        { text: p.rutF, alignment: 'center' },
        { text: p.ficha, alignment: 'center' },

        { text: p.total_bonos.toLocaleString('es-ES'), alignment: 'center' },
      ]
    });

    let wids = [];
    for(let i=0;i<tableHeader.length;i++){
      wids.push('auto')
    }

    let today = new Date();
    let docDefinition = {

  pageOrientation: 'landscape',
  pageSize: 'A3',
  pageMargins: [40, 60, 40, 60],
  info: {
    title: 'Reporte diferencia sábado y domingo',

  },
  //watermark: { text: 'test watermark', color: 'blue', opacity: 0.3, bold: true, italics: false },
  content: [
    // Previous configuration
    {
      text: 'REPORTE DIFERENCIA SÁBADO Y DOMINGO',
      fontSize: 16,
      alignment: 'center',
      color: '#047886',
      margin: [0, 10],

    },
    {
      text : 'Libro: Remuneraciones',
      style: 'subheader',
      bold: true,
      fontSize: 10,
    },
    {
      text : 'Empresa: CONSTRUCTORA INARCO S.A. (96.513.310-0)',
      style: 'subheader',
      bold: true,
      fontSize: 10,
    },
    {
      text : 'Libro: Remuneraciones',
      style: 'subheader',
      bold: true,
      fontSize: 10,
    },
    {
      text : 'Periodo: Remuneraciones',
      style: 'subheader',
      bold: true,
      fontSize: 10,
    },
    {
      text : 'Fecha generación: '+today.toLocaleDateString(),
      style: 'subheader',
      bold: true,
      fontSize: 10,
    },
    {
     /*  table: {
        headerRows: 1,

        widths: wids,

        body: [
          tableHeader, ...bodyTable,

        ],
        alignment: 'center'


      }, */
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
  pdfMake.createPdf(docDefinition).download('reporte_detalle_pagos.pdf');
} else if (action === 'print') {
  pdfMake.createPdf(docDefinition).print();
} else {
  pdfMake.createPdf(docDefinition, { filename: 'detalle_pagos.pdf' }).open();
}
  }

  rowSelection = this.aggsv.rowSelection;
  overlayLoadingTemplate = this.aggsv.overlayLoadingTemplate;
  overlayNoRowsTemplate = this.aggsv.overlayNoRowsTemplate;
  localeText = this.aggsv.getLocale();

  defaultColDef: ColDef = {
    resizable: true,
    initialWidth: 200,
    editable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };
  CurrencyCellRenderer(params: any) {

    var usdFormate = new Intl.NumberFormat();
    return usdFormate.format(params.value);
  }

  headings = [
    [
      'RUT',
      'Código de ficha',
      'Diferencia mensual Sábado',
      'Diferencia mensual Domingo',
      'Detalle',

    ],
  ];
}
