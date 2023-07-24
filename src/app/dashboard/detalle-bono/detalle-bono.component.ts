import { Component, OnInit, ViewChild } from '@angular/core';
import { BonosService } from './services/bonos.service';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { ToastrService } from 'ngx-toastr';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { ColDef } from 'ag-grid-community';
import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
import { AgGridAngular } from 'ag-grid-angular';
import { InputHeaderComponent } from 'src/app/shared/components/table-aggrid/input-header/input-header.component';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
@Component({
  selector: 'app-detalle-bono',
  templateUrl: './detalle-bono.component.html',
  styleUrls: ['./detalle-bono.component.css']
})
export class DetalleBonoComponent implements OnInit {
  @ViewChild('Grid') agGrid: AgGridAngular;

  constructor(
    private bonoSV : BonosService,
    private BuildMonthService : BuildMonthService,
    private toast : ToastrService,
    private paramSV : ParametrosService,
    private aggsv : AgGridSpanishService) { }

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

  columnDefs:ColDef[] = [ {
    headerName: 'ID',
    field: 'correlativo',
    filter: false,
    floatingFilter: false,
    editable : false,
    width:80,
    pinned: 'left',
    lockPinned: true,
  },
  {
    headerName: 'Nombre',
    field: 'nombre',
    filter: true,
    width:250,
    floatingFilter: true,
    editable : false,
    pinned: 'left',
    lockPinned: true,
  },
  {
    headerName: 'RUT',
    field: 'rutF',
    filter: true,
    floatingFilter: true,
    editable : false,
    width:200,
    pinned: 'left',
    lockPinned: true,
  },
  {
    headerName: 'N. de ficha',
    field: 'ficha',
    filter: false,
    floatingFilter: false,
    editable : false,
    width:80,
    pinned: 'left',
    lockPinned: true,
    cellClass: params =>{return this.dictFicha[params.value];},
  },

];
headings = [[
  'RUT',
  'Código de ficha',
  'Valor',
  'Detalle'
]];

dictFicha: any = {
  F1: 'badge-outline-primary',
  F2: 'badge-outline-info2',
  F3: 'badge-outline-warning2',
  F4: 'badge-outline-info',
  F5: 'badge-outline-danger2'
}
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  data : any=[];
  get(){
    let body = {
      tipo : 'bonos',
      obra : this.obra.codigo,
      accion: 'C'
    }
    this.bonoSV.get(body).subscribe((r:any)=>{
        //this.data = r.result.bonos;
        this.data = r.result.bonos.map((value,i) => {
          this.agGrid.api.sizeColumnsToFit();
          return {
            ...value,
            correlativo : i+1,
            rutF : this.formatRut(value.rut,value.dig),
            isEdit: false
          }
        });

        console.log(this.data)
    })
  }

  bonos=[];
   getBonos(){
    let b = {
      tipo : 'bonos',
      accion : 'C',
      obra: this.obra.codigo
    }
    this.paramSV.getBonos(b).subscribe(r=>{
      console.log(r);
      this.bonos = r['result'].bonos.map((x,i)=>{
        return {
          key : `bono${i+1}`,
          descripcion : x.descripcion
        }
      });
      console.log('response parametros bonos agregados',this.bonos);
      for(let i=0;i<10;i++){
        if(this.bonos[i]){
          this.columnDefs.push({
            headerComponent: InputHeaderComponent,
            headerComponentParams : {
              label:this.bonos[i].descripcion,
              index : i
            },
            //headerName: this.bonos[i].descripcion,
            field: `bono${i+1}`,
            width:150,
            filter: false,
            floatingFilter: false,
            editable : true,
            cellRenderer: this.CurrencyCellRenderer, cellRendererParams: {
              currency: 'CLP'
            },
          })
        }else{
          this.columnDefs.push({

            headerComponent: InputHeaderComponent,
            headerComponentParams : {

              index : i
            },
           // headerName: '',
            field: `bono${i+1}`,
            width:150,
            filter: false,
            floatingFilter: false,
            editable : true
          })
        }
      }

      this.columnDefs.push({
        headerName: 'Total bonos del mes',
        field: `total_bonos`,
        filter: false,
        floatingFilter: false,

        editable : false,
        cellRenderer: this.CurrencyCellRenderer, cellRendererParams: {
          currency: 'CLP'
        },
      });

      this.agGrid.api.setColumnDefs(this.columnDefs);



    })
  }
  CurrencyCellRenderer(params: any) {

    var usdFormate = new Intl.NumberFormat();
    return usdFormate.format(params.value);
  }

  formatRut(rut,dig){

    return this.BuildMonthService.formatRut(rut,dig);
  }

  saveEdit(item){

    let b = {
      tipo: 'bonos',
      accion: 'M',
      obra: this.obra.codigo,
     ...item.data
    }
    console.log('body',b, item);
    this.bonoSV.get(b).subscribe((r: any) => {
      console.log(r);
     /*  let reemplazar = this.data.findIndex(x=>x.id == r['result'].bonos[0].id);
      this.data[reemplazar] = r['result'].bonos[0]; */
      this.get();
      this.toast.success('Actualizado con éxito',`Bono de ${item.data.nombre}`);


    })
  }

  createPDF(action = 'open') {
    let tableHeader = [
      {text:'N°',alignment: 'center',margin: [0, 10]},
      {text:'Nombre completo',fontSize:25,bold:true,alignment: 'center',margin: [0, 10]},
      {text:'N° de ficha',alignment: 'center',margin: [0, 10]},
      {text:'Rut',alignment: 'center',margin: [0, 10]},
      {text:'Especialidad',alignment: 'center',margin: [0, 10]},
      {text:'Dias a pago',alignment: 'center',margin: [0, 10]},
      {text:'Total periodo',alignment: 'center',margin: [0, 10]},
      {text:'Horas extras legal lunes a sábado',alignment: 'center',margin: [0, 10]},
      {text:'Total valor hora líquido',alignment: 'center',margin: [0, 10]},
      {text:'Diferencia de días sábado',alignment: 'center',margin: [0, 10]},
      {text:'TOTAL BONOS',alignment: 'center',margin: [0, 10]},
      {text:'Asignaciones',alignment: 'center',margin: [0, 10]},
      {text:'Total ganado',alignment: 'center',margin: [0, 10]},
      {text:'Anticipo',alignment: 'center',margin: [0, 10]},
      {text:'Descuentos varios',alignment: 'center',margin: [0, 10]},
      {text:'Remuneración',alignment: 'center',margin: [0, 10]},
      {text:'Finiquito fin de mes',alignment: 'center',margin: [0, 10]},
      {text:'Líquido a pagar',alignment: 'center',margin: [0, 10]}]
    let bodyTable= this.data.map((p,i) => {

      return  [
        i+1,
        {text : p.nombre,alignment: 'center'},
        {text : p.ficha,alignment: 'center'},
        {text : `${p.rut}-${p.dig}`,alignment: 'center'},
        {text : p.descripcion.trim(),alignment: 'center'},
        {text : p.dias,alignment: 'center'},
        {text : p.total_periodo.toLocaleString('es-ES'),alignment: 'center'},
        {text : Number(p.hor_lun_sab).toLocaleString('es-ES'),alignment: 'center'},
        {text : Number(p.valor_hora).toLocaleString('es-ES'),alignment: 'center'},
        {text : p.difer_sabado.toLocaleString('es-ES'),alignment: 'center'},
        {text : p.total_bonos.toLocaleString('es-ES'),alignment: 'center'},
        {text : p.asignaciones.toLocaleString('es-ES'),alignment: 'center'},
        {text : p.total_ganado.toLocaleString('es-ES'),alignment: 'center'},
        {text : p.anticipo.toLocaleString('es-ES'),alignment: 'center'},
        {text : p.dctos_varios.toLocaleString('es-ES'),alignment: 'center'},
        {text : p.a_pagar.toLocaleString('es-ES'),alignment: 'center'},
        {text : p.finiquito_findemes.toLocaleString('es-ES'),alignment: 'center'},
        {text : p.liq_apagar.toLocaleString('es-ES'),alignment: 'center'},
      ]
    });

    console.log(bodyTable)
    let docDefinition = {
      pageBreak: 'after',
      pageOrientation: 'landscape',
      pageSize: 'A2',
      pageMargins: [ 40, 60, 40, 60 ],
      info: {
        title: 'Reporte detalle pagos',

      },
      //watermark: { text: 'test watermark', color: 'blue', opacity: 0.3, bold: true, italics: false },
      content: [
          // Previous configuration
          {
            text: 'REPORTE DETALLE PAGOS',
            fontSize: 16,
            alignment: 'center',
            color: '#047886',
            margin: [0, 10]
          },


        {
          table: {
            headerRows: 1,

            widths: [
              15,
              250,
              '*',
              80,
              200,
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto'],

              body: [
                 tableHeader,...bodyTable,


                  [
                    {},
                    {},
                    {},
                    {},
                    { text: 'TOTALES PERIODOS', colspan : 3,bold:true,alignment: 'center'},
                    {text:this.data.reduce((sum,p)=>sum+p.dias,0),alignment: 'center'},
                    {text:this.data.reduce((sum,p)=>sum+p.total_periodo,0).toLocaleString('es-ES'),alignment: 'center'},
                    {text:this.data.reduce((sum,p)=>sum+Number(p.hor_lun_sab),0).toLocaleString('es-ES'),alignment: 'center'},
                    {text:this.data.reduce((sum,p)=>sum+p.valor_hora,0).toLocaleString('es-ES'),alignment: 'center'},
                    {text:this.data.reduce((sum,p)=>sum+p.difer_sabado,0).toLocaleString('es-ES'),alignment: 'center'},
                    {text:this.data.reduce((sum,p)=>sum+p.total_bonos,0).toLocaleString('es-ES'),alignment: 'center'},
                    {text:this.data.reduce((sum,p)=>sum+p.asignaciones,0).toLocaleString('es-ES'),alignment: 'center'},
                    {text:this.data.reduce((sum,p)=>sum+p.total_ganado,0).toLocaleString('es-ES'),alignment: 'center'},
                    {text:this.data.reduce((sum,p)=>sum+p.anticipo,0).toLocaleString('es-ES'),alignment: 'center'},
                    {text:this.data.reduce((sum,p)=>sum+p.dctos_varios,0).toLocaleString('es-ES'),alignment: 'center'},
                    {text:this.data.reduce((sum,p)=>sum+p.a_pagar,0).toLocaleString('es-ES'),alignment: 'center'},
                    {text:this.data.reduce((sum,p)=>sum+p.finiquito_findemes,0).toLocaleString('es-ES'),alignment: 'center'},
                    {text:this.data.reduce((sum,p)=>sum+p.liq_apagar,0).toLocaleString('es-ES'),alignment: 'center'}
                  ]
              ],
              alignment: 'center'


          },
      },
      {
        columns : [
        {
          width: 250,text : '',
        },
          {
            width: 250,
            text : 'V°B° Admnistrador de obra',
            margin: [0, 100],
            decoration : 'overline'
          },
          {
            width: 250,
            text : 'V°B° Gerente de obra',
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

    if(action==='download'){
      pdfMake.createPdf(docDefinition).download('reporte_detalle_pagos.pdf');
    }else if(action === 'print'){
      pdfMake.createPdf(docDefinition).print();
    }else{
      pdfMake.createPdf(docDefinition,{filename : 'detalle_pagos.pdf'}).open();
    }


  }


}
