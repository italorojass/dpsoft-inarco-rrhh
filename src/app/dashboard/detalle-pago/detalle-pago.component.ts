import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { DetallePagoService } from './services/detalle-pago.service';
import { ToastrService } from 'ngx-toastr';
import { ProyectosService } from '../proyectos/services/proyectos.service';
import ChileanRutify from 'chilean-rutify';
import { GuiCellView, GuiColumn, GuiColumnAlign, GuiDataType, GuiPaging, GuiPagingDisplay, GuiSearching, GuiSorting } from '@generic-ui/ngx-grid';
import { ColDef } from 'ag-grid-community';
import { ButtonCellRendererComponent } from 'src/app/shared/components/button-cell-renderer/button-cell-renderer.component';
@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.css']
})
export class DetallePagoComponent implements OnInit {
  //mostrar liquido a pagar
  //en  pop up finiquito fin de mes va a validar contra el sueldo liquido
  //el resto se calcula en base a remuneracion a pagar
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: any;

  dtOptions: DataTables.Settings = {};
  totalPeriodoEdit: any;
  totalRemuneracionEdit: any;
  totalDesctEdit: any;
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };

    this.getEspecialidad();
    /* this.editPagoForm.valueChanges.subscribe((values:any)=>{
      //console.log(values);

       this.totalPeriodoEdit= ((values.sueldo_liq /30) * values.dias).toFixed(2);

       this.totalRemuneracionEdit = (values.ajuste_pos + values.asignaciones);

       this.totalDesctEdit = (values.anticipo - values.dctos_varios);
       //remuneracion a pagar
       // total periodo + totalvalorhoraextraliquido+totalbonos+asignaciones+diferdom+ajustePos - los descuentos
    }); */

    this.getPagos();

    this.editPagoForm.controls['rut'].valueChanges.subscribe(value => {
      let dig = ChileanRutify.getRutVerifier(value);
      this.editPagoForm.controls['dig'].patchValue(dig);

      /* let validRut = ChileanRutify.validRut(`${value}-${dig}`);
      console.log(dig,validRut) */
    })

  }

  formatRut(rut, dig) {

    return this.BuildMonthService.formatRut(rut, dig);
  }

  data: any = [];
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  searchTerm: string;
  page = 1;
  pageSize = 4;
  collectionSize: number;

  async getPagos() {
    this.data = [];

    let body = {
      tipo: 'pagos',
      obra: this.obra.codigo,
      accion: 'C'
    }
    this.dtSv.get(body).subscribe((r: any) => {
      // this.data = r.result.pagos;
      let c = 0;
      this.data = r.result.pagos.map(x => {
        c++;
        return {
          ...x,
          correlativo: c,
          rutF: ChileanRutify.formatRut(`${x.rut}-${x.dig}`)
        }
      });
      //this.loading = false;
      console.log(this.data)
    })
  }


  columns: Array<GuiColumn> = [
    {
      header: 'Nombre',
      field: 'nombre'
    },
    {
      header: 'N. Ficha',
      field: 'ficha',
      width: 50,
      view: (value: string) => {
        if (value == 'F1') {
          return `<div style="color: blue;font-weight: bold">${value}</div>`;
        } else if (value == 'F2') {
          return `<div style="color: red;font-weight: bold">${value}</div>`;
        } else {
          return `<div style="color: green">${value}</div>`;
        }
      }
    },
    {
      header: 'Rut',
      field: 'rutF',
    },
    {
      header: 'Especialidad',
      field: 'descripcion',
    },
    {
      header: 'Sueldo líquido',
      field: 'sueldo_liq',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Días a pago',
      field: 'dias',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Valor hora extra',
      field: 'valor_hora',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Total periodo',
      field: 'total_periodo',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Hora extra legal lunes a sábados',
      field: 'hor_lun_sab',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Total valor hora extra líquido',
      field: 'val_lun_sab',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Diferencia días sabados',
      field: 'difer_sabado',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Diferencia días domingos',
      field: 'difer_domingo',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Total bonos',
      field: 'total_bonos',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Zona 10%',
      field: 'zona10',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    }, {
      header: 'Viático',
      field: 'viatico',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'aguinaldo',
      field: 'aguinaldo',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Asignaciones',
      field: 'asignaciones',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Ajuste positivo',
      field: 'ajuste_pos',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Total ganado',
      field: 'total_ganado',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Anticipo',
      field: 'anticipo',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Descuentos varios',
      field: 'dctos_varios',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Remuneración a pagar',
      field: 'a_pagar',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Finiquito quincena',
      field: 'finiquito_quincena',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Finiquito fin de mes',
      field: 'finiquito',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'

        ]
      }

    },
    {
      header: 'Líquido a pagar',
      field: 'liq_apagar',
      type: GuiDataType.NUMBER,
      align: GuiColumnAlign.RIGHT,
      summaries: {
        enabled: true,
        summariesTypes: [
          'sum'
        ]
      }

    },
  ];

  columnDefs: ColDef[] = [
    {
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
    },
    {
      headerName: 'ID',
      field: 'correlativo',
      width: 80,
      pinned: 'left',
      filter: false,
      floatingFilter: false
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 150,
      suppressSizeToFit: true,
      pinned: 'left',
      lockPinned: true,
      cellClass: 'lock-pinned',
    },
    {
      field: 'ficha',
      headerName: 'Ficha',
      width: 100,
      sortable: true,
      pinned: 'left'
    },
    {
      field: 'rutF',
      headerName: 'Rut',
      width: 140,
      sortable: true,
      pinned: 'left',
      lockPinned: true,
      cellClass: 'lock-pinned',
    },
    {
      field: 'descripcion',
      headerName: 'Especialidad',
      width: 280,
      sortable: true
    },
    {
      field: 'sueldo_liq',
      headerName: 'Sueldo líquido',
      width: 150,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer, cellRendererParams: {
        currency: 'CLP'
      }
    },
    {
      field: 'dias',
      headerName:
        'Días a pago',
      width: 110,
      sortable: true
    },
    {
      field: 'valor_hora', headerName: 'Valor hora extra líquido', width: 100, sortable: true, cellRenderer: this.CurrencyCellRenderer
    },
    { field: 'total_periodo', headerName: 'Total periodo', width: 100, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'hor_lun_sab', headerName: 'Hora extra legal lunes a sábado', width: 100, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'val_lun_sab', headerName: 'Total valor hora extra líquido', width: 180, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'difer_sabado', headerName: 'Diferencia días sábados', width: 150, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'difer_domingo', headerName: 'Diferencia días domingo', width: 150, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'total_bonos', headerName: 'Total bonos', width: 100, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'zona10', headerName: 'Zona 10%', width: 100, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'viatico', headerName: 'Viático', width: 100, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'aguinaldo', headerName: 'Aguinaldo', width: 150, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'asignaciones', headerName: 'Asignaciones', width: 150, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'ajuste_pos', headerName: 'Ajuste positivo', width: 150, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'total_ganado', headerName: 'Total ganado', width: 150, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'anticipo', headerName: 'Anticipos', width: 150, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'dctos_varios', headerName: 'Descuentos varios', width: 200, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'difer_sabado', headerName: 'Diferencia días sábados', width: 200, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'a_pagar', headerName: 'Remuneración a pagar', width: 200, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'finiquito_quincena', headerName: 'Finiquito quincena', width: 200, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'finiquito', headerName: 'Finiquito', width: 100, sortable: true, cellRenderer: this.CurrencyCellRenderer },
    { field: 'liq_apagar', headerName: 'Líquido a pagar', width: 100, sortable: true, cellRenderer: this.CurrencyCellRenderer, pinned: 'right' },

  ];
  tooltipShowDelay = 500;



  CurrencyCellRenderer(params: any) {

    var usdFormate = new Intl.NumberFormat();
    return usdFormate.format(params.value);
  }

  dictFicha: any = {
    F1: 'badge-outline-primary',
    F2: 'badge-outline-info2',
    F3: 'badge-outline-warning2',
    F4: 'badge-outline-info',
    F5: 'badge-outline-danger2'
  }

  getBadgeFicha(ficha: any) {
    return this.dictFicha[ficha];
  }



  getTotalPeriodo(sueldoLiquido: any, diasPago: any = 30) {
    return (sueldoLiquido / 30) * diasPago;
  }


  constructor(private fb: FormBuilder, private dtSv: DetallePagoService, private toastr: ToastrService, private ps: ProyectosService, private BuildMonthService: BuildMonthService) { }

  editPagoForm = this.fb.group({
    rut: ['', [Validators.required, Validators.maxLength(8)]],
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
    zona10: [0],
    viatico: [0],
    aguinaldo: [0],
    finiquito_findemes: [0],
  });

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
      zona10: this.editPagoForm.value.zona10,
      viatico: this.editPagoForm.value.viatico,
      asignaciones: this.editPagoForm.value.asignaciones,
      aguinaldo: this.editPagoForm.value.aguinaldo,
      finiquito_findemes: this.editPagoForm.value.finiquito_findemes
    }
    console.log('body edit', body1);
    this.dtSv.get(body1).subscribe(r => {
      //console.log('response edit',r);

      this.resetForm();
      this.closeModalEdit.nativeElement.click();
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
      nombre: this.editPagoForm.value.nombre,
      ficha: this.editPagoForm.value.ficha,
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
      this.toastr.success('Trabajador creado', '')
      this.resetForm();
      this.closeModal.nativeElement.click() //<-- here
      this.getPagos();

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


  getTotalSueldoLiq() {
    let sueldo = 0;
    this.data.forEach((element: any) => {
      sueldo += Number(element.sueldo_liq);

    });
    return sueldo;
  }

  getTotalValor_hora() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.valor_hora);

    });
    return result;
  }


  getTotaltotal_periodo() {
    let result = 0;
    this.data.forEach((element: any) => {
      if (element.total_periodo) {
        result += Number(element.total_periodo);

      }

    });
    return result;
  }


  getTotalhor_lun_sab() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.hor_lun_sab);

    });
    return result;
  }

  getTotalval_lun_sab() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.val_lun_sab);

    });
    return result;
  }


  getTotaldifer_sabado() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.difer_sabado);

    });
    return result;
  }

  getTotaldifer_domingo() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.difer_domingo);

    });
    return result;
  }

  getTotaltotal_bonos() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.total_bonos);

    });
    return result;
  }

  getTotalzona10() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.zona10);

    });
    return result;
  }
  getTotalViatico() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.viatico);

    });
    return result;
  }

  getTotalAguinaldo() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.aguinaldo);

    });
    return result;
  }

  getTotalAsignaciones() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.asignaciones);

    });
    return result;
  }

  getTotalajuste_pos() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.ajuste_pos);

    });
    return result;
  }

  getTotaltotal_ganado() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.total_ganado);

    });
    return result;
  }

  getTotalanticipo() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.anticipo);

    });
    return result;
  }

  getTotaldctos_varios() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.dctos_varios);

    });
    return result;
  }

  getTotala_pagar() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.dctos_varios);

    });
    return result;
  }

  getTotalfiniquito() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.dctos_varios);

    });
    return result;
  }

  getTotalliq_apagar() {
    let result = 0;
    this.data.forEach((element: any) => {
      result += Number(element.liq_apagar);

    });
    return result;
  }






}
