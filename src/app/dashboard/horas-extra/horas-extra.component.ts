import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { HoraextraService } from './services/horaextra.service';
import { FormBuilder } from '@angular/forms';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowClassRules,
  RowValueChangedEvent,
} from 'ag-grid-community';
import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { ToastrService } from 'ngx-toastr';
import { CentralizaPeriodosService } from 'src/app/shared/services/centraliza-periodos.service';
import { Observable, of, Subscription, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-horas-extra',
  templateUrl: './horas-extra.component.html',
  styleUrls: ['./horas-extra.component.css'],
})
export class HorasExtraComponent implements OnInit {
  constructor(
    private dtSv: HoraextraService,
    private bt: BuildMonthService,
    private fb: FormBuilder,
    public ParametrosService: ParametrosService,
    private toastr: ToastrService,
    private aggsv: AgGridSpanishService,
    private periodos : CentralizaPeriodosService
  ) {}
  @ViewChild('heGrid') grid!: AgGridAngular;

  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  totalSm: any = [];
  formDate = this.fb.group({
    inicio: [''],
    final: [''],
  });
  datosParametros: any;
  columnDefs = [];
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

  rowSelection = this.aggsv.rowSelection;
  overlayLoadingTemplate = this.aggsv.overlayLoadingTemplate;
  overlayNoRowsTemplate = this.aggsv.overlayNoRowsTemplate;
  localeText = this.aggsv.getLocale();

  rowClassRules: RowClassRules = {
    // row style function
    'sick-days-warning': (params) => {

      return params.data.ciequincena === 'S';
    },
    // row style expression

  };

  private subscription: Subscription;

  ngOnInit() {
    this.datosParametros = JSON.parse(sessionStorage.getItem('periodoAbierto'));

    this.titlepage = sessionStorage.getItem('titlePage');

    this.getFeriadosActuales().pipe(
      switchMap((feriado)=>{
        this.feriados = feriado;
        console.log('response feriado',feriado);
        //return this.getPeriodo()
        return this.getCalendarios()
      })
    ).subscribe((r:any)=>{
      let res = r['result'].parametros[0];
      //this.datosParametros = res;
      console.log('response periodo',r);
      this.columnDefs.push(
        {
          headerName: 'ID',
          field: 'correlativo',
          width: 80,
          pinned: 'left',
          filter: false,
          floatingFilter: false,
          editable : (params) => params.data.ciequincena !== 'S'&& this.datosParametros.estado =='A',
        },
        {
          field: 'nombre',
          headerName: 'Nombre',
          width: 250,
          minWidth: 170,
          suppressSizeToFit: true,
          pinned: 'left',
          lockPinned: true,
          cellClass: 'lock-pinned',

          editable : (params) => params.data.ciequincena !== 'S'&& this.datosParametros.estado =='A',
        }
      );


      this.formDate.patchValue({
        inicio: res.inicio_periodo,
        final: res.final_periodo,
      });
      let cabecera = this.buildHeader(res.inicio_periodo, res.final_periodo);

      let todosLosFeriados = [];
      let diaferiado = ''
      if(this.feriados.length>0){
        todosLosFeriados = this.feriados.filter(x=>x.fecha);
        console.log(todosLosFeriados)
      }
      let counTotalSemana = 0;
      for (let i = 0; i < cabecera.length; i++) {
        if (cabecera[i].nombre.includes('Domingo')) {
          counTotalSemana++; //agrego acontador a total semaa
          //console.log('CANTIDAD DE SEMANAS', counTotalSemana);
          this.columnDefs.push({
            headerName: `Semana ${counTotalSemana}`,

            children: [
              {
                field: `dia${i + 1}`,
                headerName: cabecera[i].nombre.includes('totsem')
                  ? !`${cabecera[i].nombre}`
                  : `${cabecera[i].dia} | ${cabecera[i].nombre}`,
                headerClass: 'text-vertical',
                width: 80,
                suppressSizeToFit: true,
                filter: false,
                floatingFilter: false,
                editable : (params) => params.data.ciequincena !== 'S'&& this.datosParametros.estado =='A',

                cellEditor: 'agNumberCellEditor',
                cellEditorParams: {
                  min: 1,
                  max: 100,
                  precision: 0,
                },
                cellStyle: {
                  // you can use either came case or dashes, the grid converts to whats needed
                  backgroundColor: '#ff5e', // light green
                },
              },
            ],
          });

          this.columnDefs.push({
            // headerName:`Semana ${counTotalSemana}`,
            children: [
              {
                headerName: `Total semana ${counTotalSemana}`,

                field: `totsem${counTotalSemana}`,
                width: 100,
                suppressSizeToFit: true,
                filter: false,
                floatingFilter: false,
                editable: false,

                cellStyle: {
                  // you can use either came case or dashes, the grid converts to whats needed
                  backgroundColor: '#439aff', // light green
                },
              },
            ],
          });
        } else {

          if (cabecera[i].nombre.includes('Sábado')) {
            this.columnDefs.push({
              field: `dia${i + 1}`,
              headerName: cabecera[i].nombre.includes('totsem')
                ? !`${cabecera[i].nombre}`
                : `${cabecera[i].dia} | ${cabecera[i].nombre}`,
              headerClass: 'text-vertical',
              width: 80,
              suppressSizeToFit: true,
              filter: false,
              floatingFilter: false,
              editable : (params) => params.data.ciequincena !== 'S'&& this.datosParametros.estado =='A',
              cellEditor: 'agNumberCellEditor',
              cellEditorParams: {
                min: 1,
                max: 100,
                precision: 0,
              },
              cellStyle: {
                // you can use either came case or dashes, the grid converts to whats needed
                backgroundColor: '#7ed321', // light green
              },
            });
          } else {
            //todos los dias
            //TODO : crear una funcion que tome la fecha si existen feriados,
            //si existen, devolver true para q pinte de rojo la casilla entera
            this.columnDefs.push({
              field: `dia${i + 1}`,
              headerName: cabecera[i].nombre.includes('totsem')
                ? !`${cabecera[i].nombre}`
                : `${cabecera[i].dia} | ${cabecera[i].nombre}`,
              headerClass: 'text-vertical',
              width: 100,
              suppressSizeToFit: true,
              filter: false,
              floatingFilter: false,
              editable : (params) => params.data.ciequincena !== 'S'&& this.datosParametros.estado =='A',
              cellEditor: 'agNumberCellEditor',
                cellEditorParams: {
                  min: 1,
                  max: 100,
                  precision: 0,
                },
                cellStyle: {
                  // you can use either came case or dashes, the grid converts to whats needed
                 // backgroundColor: this.feriados.length >0 ? 'white' : '#7ed321', // light green
                },
            });
          }
        }
      }
      this.columnDefs.push(
        {
          field: `tothormes`,
          headerName: 'Total h. extras del mes',
          headerClass: 'text-vertical',
          width: 80,
          suppressSizeToFit: true,
          filter: false,
          floatingFilter: false,
          editable: false,
          lockPinned: true,
          pinned: 'right',
        },
        {
          field: `valhor`,
          headerName: 'Valor líquido hora extra',
          headerClass: 'text-vertical',
          width: 100,
          suppressSizeToFit: true,
          filter: false,
          floatingFilter: false,
          editable: false,
          lockPinned: true,
          pinned: 'right',
          cellRenderer: this.CurrencyCellRenderer,

          cellRendererParams: {
            currency: 'CLP',
          },
        },
        {
          field: `totvalhor`,
          headerName: 'Valor líquido total horas del mes',
          headerClass: 'text-vertical',
          width: 100,
          suppressSizeToFit: true,
          filter: false,

          floatingFilter: false,
          editable: false,
          lockPinned: true,
          pinned: 'right',
          cellRenderer: this.CurrencyCellRenderer,
          cellRendererParams: {
            currency: 'CLP',
          },
        }
      ); //los ultimos/.


      this.grid.api.setColumnDefs(this.columnDefs);
    })



    this.getHoraExtra();
  }

  titlepage ='';

  CurrencyCellRenderer(params: any) {
    return params.value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  public groupHeaderHeight = 45;
  public headerHeight = 100;
  api: any;
  columnApi;
  onGridReady(params: GridReadyEvent<any>) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    console.log('grid on ready', params);
  }

  onRowValueChanged(event: RowValueChangedEvent) {
    var data = event.data;
    console.log(data);
    this.saveEdit(data);
  }
  gridApi!: GridApi<any>;

  getPeriodo() {
    let b = {
      accion: 'P'
    };
    //console.log(b);
    return this.ParametrosService.get(b);
  }
  getCalendarios(){
    let b = {
      accion : 'C',
      obra :this.obra.codigo,
      mesyano : this.datosParametros.quemes,
      tipo_proceso : this.datosParametros.tipo_proceso
    }
    return this.ParametrosService.getCalendarioHoraExtra(b)

  }
  weekday = [];

  buildHeader(inicio, final) {
    //console.log('fechas', inicio,final);
    this.tblHeader = [];
    this.weekday = this.bt.getDaysInMonth(inicio, final);

   // console.log('weekday', this.weekday);
    let c = 0;
    let r = [];
    this.weekday.forEach((element, i) => {
      c++;
      this.tblHeader.push(element);
      r.push(element);
      if (element.nombre == 'Domingo') {
        this.tblHeader.push({ dia: c, nombre: `Total semana` });
        this.totalSm.push(element);
        //
      }
    });

    return r;

    //console.log('CABECER TABLA HTML', this.tblHeader);
  }

  tblHeader = [];
  data: any = [];
  mesesAtras : any
  getHoraExtra() {
    let body = this.periodos.buildBodyRequestComponents('extras','C')

    this.data=[];

    return this.dtSv.get(body).subscribe((r: any) => {
      console.log('data final', r);
      let c = 0;
      if(r.status=='ok'){
        this.data = r.result[0].map((value) => {
          c++;
          return {
            ...value,
            correlativo: c,
          };
        });
      }

    });
  }

  feriados :any=[]
  /* getFeriados(): Observable<any>{

    let periodoSelect = this.datosParametros.inicio_periodo.split('-');

    let testData : any = [
      {
        "nombre": "Día de la Virgen del Carmen",
        "comentarios": null,
        "fecha": "2024-07-16",
        "irrenunciable": "0",
        "tipo": "Religioso"
      }
    ]


    return of(testData)
   // return this.ParametrosService.getFeriadosMonthYear(periodoSelect[0],periodoSelect[1]);
  } */

  getFeriadosActuales(){
    let body = {
      accion : 'C',
      obra :this.obra.codigo
    }
   return  this.ParametrosService.getFeriados(body);

  }



  headings = [
    [
      'Empleado',
      'Código de ficha',
      'Horas extras 50%',
      'Horas extras 100%',
      'Horas extras 25%',
      'Horas extras 35%',
    ],
  ];

  saveEdit(item) {
    console.log('modificado', item);
    let body = {
      tipo: 'extras',
      obra: this.obra.codigo,
      accion: 'M',
      ...item,
    };
    console.log('body edit', body);
    this.dtSv.get(body).subscribe((r: any) => {
      //item.isEdit = false
      this.toastr.success(
        'Actualizado con éxito',
        `Hora extra del trabajador ${item.nombre}`
      );
      this.getHoraExtra();
    });
  }
}
