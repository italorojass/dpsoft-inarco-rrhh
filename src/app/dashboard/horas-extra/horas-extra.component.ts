import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { HoraextraService } from './services/horaextra.service';
import { FormBuilder } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent, RowValueChangedEvent } from 'ag-grid-community';
import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-horas-extra',
  templateUrl: './horas-extra.component.html',
  styleUrls: ['./horas-extra.component.css']
})
export class HorasExtraComponent implements OnInit {

  constructor(
    private dtSv: HoraextraService,
    private bt: BuildMonthService,
    private fb: FormBuilder,
    private paramSV: ParametrosService,
    private toastr: ToastrService,
    private aggsv: AgGridSpanishService) { }
  @ViewChild('heGrid') grid!: AgGridAngular;

  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  totalSm: any = [];
  formDate = this.fb.group({
    inicio: [''],
    final: [''],
  })


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

  ngOnInit() {

    this.getPeriodo().subscribe(r => {
      this.columnDefs.push({
        headerName: 'ID',
        field: 'correlativo',
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
          pinned: 'left',
          lockPinned: true,
          cellClass: 'lock-pinned',

          editable: false
        },
      );
      let res = r['result'].parametros[0];

      this.formDate.patchValue({
        inicio: res.inicio_periodo,
        final: res.final_periodo
      })
      let cabecera = this.buildHeader(res.inicio_periodo, res.final_periodo)
      console.log('datos dias', cabecera);

      let counTotalSemana = 0;
      for (let i = 0; i < cabecera.length; i++) {

        if (cabecera[i].nombre.includes('Domingo')) {
          counTotalSemana++;  //agrego acontador a total semaa
          console.log('CANTIDAD DE SEMANAS', counTotalSemana)
          this.columnDefs.push(
            {
              headerName: `Semana ${counTotalSemana}`,
              children: [{
                field: `dia${i + 1}`,
                headerName: cabecera[i].nombre.includes('totsem') ? ! `${cabecera[i].nombre}` : `${cabecera[i].dia} | ${cabecera[i].nombre}`,
                width: 150,
                suppressSizeToFit: true,
                editable: true
              }]

            })

          this.columnDefs.push(
            {
              // headerName:`Semana ${counTotalSemana}`,
              children: [{
                headerName: `Total semana ${counTotalSemana}`,
                field: `totsem${counTotalSemana}`,
                width: 150,
                suppressSizeToFit: true,
                editable: false
              }
              ],
            })
        } else {
          this.columnDefs.push(
            {
              field: `dia${i + 1}`,
                headerName: cabecera[i].nombre.includes('totsem') ? ! `${cabecera[i].nombre}` : `${cabecera[i].dia} | ${cabecera[i].nombre}`,
                width: 150,
                suppressSizeToFit: true,
                editable: true

            })//arma cabecera ok
        }

      }
      this.columnDefs.push(
        {
          field: `tothormes`,
          headerName: 'Total h. extras del mes',
          width: 150,
          suppressSizeToFit: true,
          editable: false
        },
        {
          field: `valhor`,
          headerName: 'Valor líquido hora extra',
          width: 150,
          suppressSizeToFit: true,
          editable: false
        },
        {
          field: `totvalhor`,
          headerName: 'Valor líquido total horas del mes',
          width: 150,
          suppressSizeToFit: true,
          editable: false
        }) //los ultimos/.
      console.log('columDef Final', this.columnDefs);

      this.grid.api.setColumnDefs(this.columnDefs)


    });

    this.getHoraExtra();



  }


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
  gridApi!: GridApi<any>;


  getPeriodo() {
    let b = {
      accion: 'C',
      obra: this.obra.codigo
    }
    return this.paramSV.get(b)
    //return this.buildHeader(this.formDate.value.inicio,this.formDate.value.final);
  }
  weekday = [];

  buildHeader(inicio, final) {
    this.tblHeader = [];
    this.weekday = this.bt.getDaysInMonth(inicio, final);

    console.log('weekday', this.weekday);
    let c = 0;
    let r = []
    this.weekday.forEach((element, i) => {
      c++
      this.tblHeader.push(element)
      r.push(element)
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
  getHoraExtra() {
    let body = {
      tipo: 'extras',
      obra: this.obra.codigo,
      accion: 'C'
    }
    this.dtSv.get(body).subscribe((r: any) => {

      console.log('data final', r)
      let c = 0;
      this.data = r.result.extras.map((value) => {
        c++;
        return {
          ...value,
          correlativo: c,
          isEdit: false
        }
      });
    })


  }




  saveEdit(item) {
    console.log('modificado', item);
    let body = {
      tipo: 'extras',
      obra: this.obra.codigo,
      accion: 'M',
      ...item
    }
    console.log('body edit', body);
    this.dtSv.get(body).subscribe((r: any) => {

      //item.isEdit = false
      this.toastr.success('Actualizado con éxito', `Hora extra del trabajador ${item.nombre}`);
      this.getHoraExtra()

    })
  }



}
