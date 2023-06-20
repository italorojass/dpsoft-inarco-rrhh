import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DetallePagoService } from './services/detalle-pago.service';
import { ToastrService } from 'ngx-toastr';
import ChileanRutify from 'chilean-rutify';
import { ColDef, ICellEditorParams, RowValueChangedEvent } from 'ag-grid-community';
import { AgGridSpanishService } from 'src/app/shared/services/ag-grid-spanish.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ProyectosService } from 'src/app/shared/components/proyectos/services/proyectos.service';
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


   ngOnInit() {

     this.getEspecialidad();

    this.getPagos();

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
   let keys=this.especialidades.map(x=>{
    return x.descripcion
  });

  return {
    values: keys,
    formatValue: (value) => `${value} (${selectedCountry})`,
  };
  };

  getChanges(e){
    console.log('este cambiar',e);
    let indexEspecialidad = this.especialidades.find(x=>x.descripcion.trim() == e.descripcion.trim());
    console.log('especialidad id',indexEspecialidad);

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
      finiquito: Number(e.finiquito),
      zona10: Number(e.zona10),
      viatico: Number(e.viatico),
      asignaciones: Number(e.asignaciones),
      aguinaldo: Number(e.aguinaldo),
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

  data=[];
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  searchTerm: string;
  page = 1;
  pageSize = 4;
  collectionSize: number;

   getPagos() {
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
      calcTotalCols.forEach((params)=>{
          result[0][params] = 0
      });
     // calculate all total columns
      calcTotalCols.forEach((params)=>{
        this.data.forEach((line)=> {
              result[0][params] += line[params];
          });
      });


      this.grid.api.setPinnedBottomRowData(result);
      this.defaultColDef.editable = (o) => !o.node.isRowPinned();
      //this.pinnedBottomRowData = this.createPinnedData(this.data)
    })
  }

  @ViewChild('dtGrid') grid!: AgGridAngular;
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
  columnDefs:ColDef[] = [
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
      autoHeight: true,
      editable : false
    }, */
    {
      headerName: 'ID',
      field: 'correlativo',
      width: 80,
      pinned: 'left',
      filter: false,
      floatingFilter: false,
      editable : false
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 250,
      suppressSizeToFit: true,
      pinned: 'left',
      lockPinned: true,
      cellClass: 'lock-pinned',

      editable : false
    },
    {
      field: 'ficha',
      headerName: 'Ficha',
      width: 100,
      sortable: true,
      pinned: 'left',
      editable : false,
      cellClass: params => {
        return this.dictFicha[params.value];
    }
    },
    {
      field: 'rutF',
      headerName: 'Rut',
      width: 140,
      sortable: true,
      pinned: 'left',
      lockPinned: true,
      cellClass: 'lock-pinned',
      editable : false
    },
    {
      field: 'descripcion',
      headerName: 'Especialidad',
      width: 280,
      sortable: true,
      editable : true,
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
      editable : true
    },
    {
      field: 'dias',
      headerName:
        'Días a pago',
      width: 110,
      sortable: true,
      editable : true
    },
    {
      field: 'valor_hora',
      headerName: 'Valor hora extra líquido',
      width: 100,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable : true
    },
    {
      field: 'total_periodo',
      headerName: 'Total periodo',
      width: 100, sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable : false
    },
    {
      field: 'hor_lun_sab',
      headerName: 'Hora extra legal lunes a sábado',
      width: 100, sortable: true,
      editable : false
    },
    {
      field: 'val_lun_sab',
      headerName: 'Total valor hora extra líquido',
      width: 180, sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable : false
    },
    {
      field: 'difer_sabado',
      headerName: 'Diferencia días sábados',
      width: 150, sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable : false
     },
    {
      field: 'difer_domingo',
      headerName: 'Diferencia días domingo',
       width: 150,
       sortable: true,
       cellRenderer: this.CurrencyCellRenderer ,
       editable : false
      },
    {
      field: 'total_bonos',
      headerName: 'Total bonos',
      width: 100,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer ,
      editable : false
    },
    {
      field: 'zona10',
      headerName: 'Zona 10%',
      width: 100,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer ,
      editable : true
    },
    {
      field: 'viatico',
      headerName: 'Viático',
       width: 100,
       sortable: true,
       cellRenderer:
       this.CurrencyCellRenderer,
       editable : true
       },
    {
      field: 'aguinaldo',
      headerName: 'Aguinaldo',
      width: 150,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable : true
     },
    {
      field: 'asignaciones',
      headerName: 'Asignaciones',
      width: 150,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable : true
     },
    {
      field: 'ajuste_pos',
      headerName: 'Ajuste positivo',
      width: 150,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable : true
     },
    {
      field: 'total_ganado',
      headerName: 'Total ganado',
       width: 150, sortable: true,
       cellRenderer: this.CurrencyCellRenderer ,
       editable : false
      },
    {
      field: 'anticipo',
      headerName: 'Anticipos',
      width: 150,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable : true
    },
    {
      field: 'dctos_varios',
      headerName: 'Descuentos varios',
      width: 200, sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable : true
     },
    {
      field: 'difer_sabado',
      headerName: 'Diferencia días sábados',
      width: 200, sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable : false  },
    {
      field: 'a_pagar',
      headerName: 'Remuneración a pagar',
      width: 200,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable : false
     },
    {
      field: 'finiquito',
      headerName: 'Finiquito quincena',
      width: 200,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable : true
     },
    {
      field: 'finiquito_findemes',
      headerName: 'Finiquito',
      width: 100,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      editable : true
     },
    {
      field: 'liq_apagar',
      headerName: 'Líquido a pagar',
      width: 100,
      sortable: true,
      cellRenderer: this.CurrencyCellRenderer,
      pinned: 'right',
      editable : false ,
      cellStyle: {
        // you can use either came case or dashes, the grid converts to whats needed
        backgroundColor: '#7ed321', // light green
      },},

  ];
  gridOptions = {
    columnDefs: this.columnDefs,
    rowData: []
  };
  pinnedBottomRowData: any[] ;

  onRowValueChanged(event: RowValueChangedEvent) {
    var data = event.data;
    console.log('guardar',data);
    this.getChanges(data);

  }

  CurrencyCellRenderer1(params: any) {


    return parseFloat(params.value);
  }

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


  constructor(private fb: FormBuilder,
    private dtSv: DetallePagoService,
    private toastr: ToastrService,
    private ps: ProyectosService,
    private aggsv : AgGridSpanishService,
    private BuildMonthService: BuildMonthService) { }

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






}
