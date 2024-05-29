import { Component, OnInit, ViewChild } from '@angular/core';
import { BonosService } from './services/bonos.service';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { ToastrService } from 'ngx-toastr';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { ColDef, RowClassRules } from 'ag-grid-community';
import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
import { AgGridAngular } from 'ag-grid-angular';
import { InputHeaderComponent } from 'src/app/shared/components/table-aggrid/input-header/input-header.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-detalle-bono',
  templateUrl: './detalle-bono.component.html',
  styleUrls: ['./detalle-bono.component.css'],
})
export class DetalleBonoComponent implements OnInit {
  @ViewChild('Grid') agGrid: AgGridAngular;

  constructor(
    private bonoSV: BonosService,
    private BuildMonthService: BuildMonthService,
    private toast: ToastrService,
    private paramSV: ParametrosService,
    private aggsv: AgGridSpanishService,
    public ParametrosService : ParametrosService
  ) {}

  overlayLoadingTemplate = this.aggsv.overlayLoadingTemplate;
  overlayNoRowsTemplate = this.aggsv.overlayNoRowsTemplate;
  localeText = this.aggsv.getLocale();
  datosParametros:any;
  titlepage ='';
  ngOnInit() {
    this.datosParametros = JSON.parse(sessionStorage.getItem('datosParam'));
    this.titlepage = sessionStorage.getItem('titlePage');

    this.get();
    this.getBonos();
  }
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

  rowClassRules: RowClassRules = {
    // row style function
    'sick-days-warning': (params) => {

      return params.data.ciequicena === 'S';
    },
    // row style expression

  };
  columnDefs: ColDef[] = [
    {
      headerName: 'ID',
      field: 'correlativo',
      filter: false,
      floatingFilter: false,
      editable: false,
      width: 80,
      pinned: 'left',
      lockPinned: true,
    },
    {
      headerName: 'Nombre',
      field: 'nombre',
      filter: true,
      width: 250,
      floatingFilter: true,
      editable: false,
      pinned: 'left',
      lockPinned: true,
    },
    {
      headerName: 'RUT',
      field: 'rutF',
      filter: true,
      floatingFilter: true,
      editable: false,
      width: 200,
      pinned: 'left',
      lockPinned: true,
    },
    {
      headerName: 'N. de ficha',
      field: 'ficha',
      filter: false,
      floatingFilter: false,
      editable: false,
      width: 90,
      pinned: 'left',
      lockPinned: true,
      cellClass: (params) => {
        return this.dictFicha[params.value];
      },
    },
    {
      headerName: 'Días',
      field: 'dias',
      filter: false,
      floatingFilter: false,
      editable: false,
      width: 90,
      pinned: 'left',
      lockPinned: true,

    },
  ];
  headings = [['RUT', 'Código de ficha', 'Valor', 'Detalle']];

  dictFicha: any = {
    F1: 'badge-outline-primary',
    F2: 'badge-outline-info2',
    F3: 'badge-outline-warning2',
    F4: 'badge-outline-info',
    F5: 'badge-outline-danger2',
  };
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  data: any = [];
  get() {
    let body = {
      tipo: 'bonos',
      obra: this.obra.codigo,
      accion: 'C',
      quemes : this.datosParametros.quemes
    };
    this.bonoSV.get(body).subscribe((r: any) => {
      //this.data = r.result.bonos;
      this.data = r.result.bonos.map((value, i) => {
        return {
          ...value,
          correlativo: i + 1,
          rutF: this.formatRut(value.rut, value.dig),
          isEdit: false,
        };
      });
      //this.agGrid.api.sizeColumnsToFit();
      console.log(this.data);
    });
  }

  bonos = [];
  getBonos() {
this.bonos=[];
    let b = {
      accion: 'C',
      obra: this.obra.codigo,
      quemes : this.datosParametros.quemes
    };
    this.paramSV.getBonos(b).subscribe((r) => {
      console.log(r);
      this.bonos = r['result'].bonos.map((x, i) => {
        return {
          key: `bono${i + 1}`,
          descripcion: x.descripcion,
        };
      });
      console.log('response parametros bonos agregados', this.bonos);
      for (let i = 0; i < 10; i++) {
        if (this.bonos[i]) {
          this.columnDefs.push({
            headerComponent: InputHeaderComponent,
            headerComponentParams: {
              label: this.bonos[i].descripcion,
              index: i,
            },
            //headerName: this.bonos[i].descripcion,
            field: `bono${i + 1}`,
            width: 150,
            filter: false,
            floatingFilter: false,
            editable : (params) => params.data.ciequicena !== 'S' && this.datosParametros.estado =='A',
            cellRenderer: this.CurrencyCellRenderer,
            cellRendererParams: {
              currency: 'CLP',
            },
          });
        } else {
          this.columnDefs.push({
            headerComponent: InputHeaderComponent,
            headerComponentParams: {
              index: i,
            },
            // headerName: '',
            field: `bono${i + 1}`,
            width: 150,
            filter: false,
            floatingFilter: false,
            editable : (params) => params.data.ciequicena !== 'S' && this.datosParametros.estado =='A',
          });
        }
      }

      this.columnDefs.push({
        headerName: 'Total bonos del mes',
        field: `total_bonos`,
        filter: false,
        floatingFilter: false,

        editable: false,
        cellRenderer: this.CurrencyCellRenderer,
        cellRendererParams: {
          currency: 'CLP',
        },
      });

      this.agGrid.api.setColumnDefs(this.columnDefs);
    });
  }
  CurrencyCellRenderer(params: any) {
    return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  formatRut(rut, dig) {
    return this.BuildMonthService.formatRut(rut, dig);
  }

  saveEdit(item) {
    let b = {
      tipo: 'bonos',
      accion: 'M',
      obra: this.obra.codigo,
      ...item.data,
    };
    console.log('body', b, item);
    this.bonoSV.get(b).subscribe((r: any) => {
      console.log(r);
      /*  let reemplazar = this.data.findIndex(x=>x.id == r['result'].bonos[0].id);
       this.data[reemplazar] = r['result'].bonos[0]; */
      this.get();
      this.toast.success(
        'Actualizado con éxito',
        `Bono de ${item.data.nombre}`
      );
    });
  }

  createPDF(action = 'open') {
    let objreport = Object.assign([], this.data);
    console.log('data base', objreport);
    let newob = objreport.filter((x) => x.total_bonos > 0);

    let tableHeader = [
      { text: 'N°', alignment: 'center', margin: [0, 10] },
      { text: 'Nombre', alignment: 'center', margin: [0, 10] },
      { text: 'RUT', alignment: 'center', margin: [0, 10] },
      //{ text: 'N° de ficha', alignment: 'center', margin: [0, 10] },
      //{ text: 'Total bonos del mes', alignment: 'center', margin: [0, 10] }
    ];
    //
    let nn = [];
    for (let i = 0; i < 10; i++) {
      if (this.bonos[i]) {
        nn.push('bono' + (i + 1));

        tableHeader.push({
          text: this.bonos[i].descripcion.trim(),
          alignment: 'center',
          margin: [0, 10],
        });
      } else {
        tableHeader.push({ text: '-', alignment: 'center', margin: [0, 10] });
      }
    }

    console.log('los q tienen', newob, 'matchear', nn);

    for (var key in newob) {
      let solobonos = newob[key];
      console.log('objeto con bono', solobonos);
    }
    let bodyTable = newob.map((p, i) => {
      return [
        { text: i + 1, alignment: 'right' },
        { text: p.nombre, alignment: 'left' },
        { text: `${p.rutF}/${p.ficha}`, alignment: 'left' },
        //{ text: p.ficha, alignment: 'center' },
        { text: p.bono1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
        { text: p.bono2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
        { text: p.bono3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
        { text: p.bono4.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
        { text: p.bono5.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
        { text: p.bono6.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
        { text: p.bono7.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
        { text: p.bono8.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
        { text: p.bono9.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
        { text: p.bono10.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
        { text: p.total_bonos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
      ];
    });
    let bodyFooter = [
      { text: '', alignment: 'right' },
      { text: '', alignment: 'left' },
      //{ text: '', alignment: 'center' },
      { text: 'Totales', alignment: 'center' },
      { text: newob.reduce(function (acc, obj) { return acc + obj.bono1; }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
      { text: newob.reduce(function (acc, obj) { return acc + obj.bono2; }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
      { text: newob.reduce(function (acc, obj) { return acc + obj.bono3; }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
      { text: newob.reduce(function (acc, obj) { return acc + obj.bono4; }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
      { text: newob.reduce(function (acc, obj) { return acc + obj.bono5; }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
      { text: newob.reduce(function (acc, obj) { return acc + obj.bono6; }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
      { text: newob.reduce(function (acc, obj) { return acc + obj.bono7; }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
      { text: newob.reduce(function (acc, obj) { return acc + obj.bono8; }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
      { text: newob.reduce(function (acc, obj) { return acc + obj.bono9; }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
      { text: newob.reduce(function (acc, obj) { return acc + obj.bono10; }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
      { text: newob.reduce(function (acc, obj) { return acc + obj.total_bonos; }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), alignment: 'right' },
    ];

    tableHeader.push({
      text: 'Total bonos del mes',
      alignment: 'center',
      margin: [0, 10],
    });
    let today = new Date().toLocaleString();

    console.log(tableHeader,bodyTable,bodyFooter);
    let wids = [];
    for (let i = 0; i < tableHeader.length; i++) {
      wids.push(70);
    }
    wids[0] ='auto';
    wids[1]=150;
    wids[2]=90;
    wids[wids.length-1] = 'auto';
    let docDefinition = {
      footer: function(currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element
        return [
          { text: 'Página ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center' ,margin: [0, 5]}
        ];

      },
      header: function(currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element
        return [{ text: 'Página ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center' ,margin: [0, 20]},
       ];

      },
      pageBreak: 'after',
      pageOrientation: 'vertical',
      pageSize: 'A2',

      pageMargins: [40, 60, 40, 60],
      info: {
        headerRows: 1,
        title: 'Reporte detalle de bonos '+this.titlepage,
      },
      //watermark: { text: 'test watermark', color: 'blue', opacity: 0.3, bold: true, italics: false },
      content: [
        // Previous configuration
        {
          text: 'REPORTE DETALLE DE BONOS '+this.titlepage,
          fontSize: 16,
          alignment: 'center',
          color: '#000',
          margin: [0, 10],
        },
        {
          columns: [
          {
            width: 300,
            text: `Obra: ${this.obra.codigo } | ${this.obra.nombre }` ,margin: [0, 10]
          },
          {
            width: '*',
            text: 'Fecha: '+today.split('T'),
            alignment: 'right',
            margin: [0, 10]
          },
        ]},

        {
          table: {
            headerRows: 1,

            widths: wids,

            body: [tableHeader, ...bodyTable,bodyFooter],
            alignment: 'left',
          },
        },
        {

          columns : [

            {
              width: 650,
              text : 'V°B° Admnistrador de obra',
              alignment: 'center',
              margin: [0, 100],
              decoration : 'overline'
            },
            {
              width: 780,
              text : 'V°B° Visitador de obra',
              alignment: 'left',
              margin: [20, 100],
              decoration : 'overline',

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
          alignment: 'center',
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
          alignment: 'center',
        },
        anotherStyle: {
          italics: true,
          alignment: 'center',
        },
      },
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download('reporte_detalle_pagos.pdf');
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake
        .createPdf(docDefinition, { filename: 'detalle_pagos.pdf' })
        .open();
    }
  }



}
