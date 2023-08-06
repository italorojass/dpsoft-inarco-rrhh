import { Component, OnInit, ViewChild } from '@angular/core';
import { BonosService } from './services/bonos.service';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { ToastrService } from 'ngx-toastr';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { ColDef } from 'ag-grid-community';
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
    private aggsv: AgGridSpanishService
  ) {}

  overlayLoadingTemplate = this.aggsv.overlayLoadingTemplate;
  overlayNoRowsTemplate = this.aggsv.overlayNoRowsTemplate;
  localeText = this.aggsv.getLocale();

  ngOnInit() {
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
      this.agGrid.api.sizeColumnsToFit();
      console.log(this.data);
    });
  }

  bonos = [];
  getBonos() {
    let b = {
      accion: 'C',
      obra: this.obra.codigo,
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
            editable: true,
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
            editable: true,
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
    var usdFormate = new Intl.NumberFormat();
    return usdFormate.format(params.value);
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
      { text: 'N° de ficha', alignment: 'center', margin: [0, 10] },
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
        { text: p.nombre, alignment: 'center' },
        { text: p.rutF, alignment: 'center' },
        { text: p.ficha, alignment: 'center' },
        { text: p.bono1.toLocaleString('es-ES'), alignment: 'center' },
        { text: p.bono2.toLocaleString('es-ES'), alignment: 'center' },
        { text: p.bono3.toLocaleString('es-ES'), alignment: 'center' },
        { text: p.bono4.toLocaleString('es-ES'), alignment: 'center' },
        { text: p.bono5.toLocaleString('es-ES'), alignment: 'center' },
        { text: p.bono6.toLocaleString('es-ES'), alignment: 'center' },
        { text: p.bono7.toLocaleString('es-ES'), alignment: 'center' },
        { text: p.bono8.toLocaleString('es-ES'), alignment: 'center' },
        { text: p.bono9.toLocaleString('es-ES'), alignment: 'center' },
        { text: p.bono10.toLocaleString('es-ES'), alignment: 'center' },
        { text: p.total_bonos.toLocaleString('es-ES'), alignment: 'center' },
      ];
    });
    tableHeader.push({
      text: 'Total bonos del mes',
      alignment: 'center',
      margin: [0, 10],
    });

    let wids = [];
    for (let i = 0; i < tableHeader.length; i++) {
      wids.push('auto');
    }
    let docDefinition = {
      pageOrientation: 'vertical',
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      info: {
        title: 'Reporte detalle de bonos',
      },
      //watermark: { text: 'test watermark', color: 'blue', opacity: 0.3, bold: true, italics: false },
      content: [
        // Previous configuration
        {
          text: 'REPORTE DETALLE DE BONOS',
          fontSize: 16,
          alignment: 'center',
          color: '#047886',
          margin: [0, 10],
        },

        {
          table: {
            headerRows: 1,

            widths: wids,

            body: [tableHeader, ...bodyTable],
            alignment: 'center',
          },
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
