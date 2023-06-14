import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { DetallePagoService } from './services/detalle-pago.service';
import { ToastrService } from 'ngx-toastr';
import { ProyectosService } from '../proyectos/services/proyectos.service';
import ChileanRutify from 'chilean-rutify';

@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.css']
})
export class DetallePagoComponent implements OnInit  {
  //mostrar liquido a pagar
  //en  pop up finiquito fin de mes va a validar contra el sueldo liquido
  //el resto se calcula en base a remuneracion a pagar
  @ViewChild(DataTableDirective, { static: false })
   datatableElement: any;

  dtOptions: DataTables.Settings = {};
  totalPeriodoEdit : any;
  totalRemuneracionEdit : any;
  totalDesctEdit : any;
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

    this.editPagoForm.controls['rut'].valueChanges.subscribe(value=>{
      let dig = ChileanRutify.getRutVerifier(value);
      this.editPagoForm.controls['dig'].patchValue(dig);

      /* let validRut = ChileanRutify.validRut(`${value}-${dig}`);
      console.log(dig,validRut) */
    })

  }

  formatRut(rut,dig){

    return this.BuildMonthService.formatRut(rut,dig);
  }

  data :any = [];
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  searchTerm: string;
  page = 1;
  pageSize = 4;
  collectionSize: number;

  async getPagos(){
    this.data=[];

    let body = {
      tipo : 'pagos',
      obra : this.obra.codigo,
      accion : 'C'
    }
    this.dtSv.get(body).subscribe((r:any)=>{
       // this.data = r.result.pagos;
       this.data = r.result.pagos;
        this.collectionSize = this.data.length
        console.log(this.data)
    })
  }



  dictFicha : any = {
    F1 : 'badge-outline-primary',
    F2 : 'badge-outline-info2',
    F3 : 'badge-outline-warning2',
    F4 :  'badge-outline-info',
    F5 :  'badge-outline-danger2'
  }

  getBadgeFicha(ficha:any){
    return this.dictFicha[ficha];
  }



getTotalPeriodo(sueldoLiquido :any, diasPago :any=30){
  return (sueldoLiquido / 30)*diasPago;
}


constructor(private fb : FormBuilder, private dtSv : DetallePagoService, private toastr : ToastrService, private ps : ProyectosService, private BuildMonthService : BuildMonthService) {}

editPagoForm = this.fb.group({
  rut : ['',[Validators.required,Validators.maxLength(8)]],
  dig: [''],
  especialidad : [Validators.required],
  ficha : ['',Validators.required],
  nombre : ['',Validators.required],
  sueldo_liq : [0,Validators.required],
  dias : [0],
  valor_hora : [0,Validators.required],
  totalPeriodo : [0],
  asignaciones : [0],
  ajuste_pos : [0],
  anticipo : [0],
  dctos_varios : [0],
  finiquito : [0],
  zona10 : [0],
  viatico : [0],
  aguinaldo : [0],
  finiquito_findemes : [0],
});

especialidades=[];
getEspecialidad(){
  let b = {
    tipo: 'pagos',
    obra: this.obra.codigo
  }
  this.ps.get(b).subscribe((data : any) => {
    console.log('response especialidades',data);
    this.especialidades = data['result']
  });
}

itemEditPago : any;
editPago(item : any){
  console.log('edit',item);
  this.itemEditPago = item;
  this.editPagoForm.patchValue({...item,
  especialidad : item.id_espec});

  let b = {
    tipo: 'pagos',
    obra: this.obra.codigo
  }


}
@ViewChild('closeModalEdit') closeModalEdit: ElementRef;

saveEditDetallePago(){
/*   let body ={
    tipo:"pagos",
    obra : this.obra.codigo,
    accion : 'M',
    id_detalle : this.itemEditPago.id,
    ...this.editPagoForm.value
 } */

 let body1= {
  tipo:"pagos",
  accion:"M",
  especialidad:this.editPagoForm.value.especialidad,
  sueldo_liq:this.editPagoForm.value.sueldo_liq,
  id_detalle:this.itemEditPago.id,
  obra:this.obra.codigo,
  dias:Number(this.editPagoForm.value.dias),
  valor_hora:this.editPagoForm.value.valor_hora,
  ajuste_pos:this.editPagoForm.value.ajuste_pos,
  anticipo:this.editPagoForm.value.anticipo,
  dctos_varios:this.editPagoForm.value.dctos_varios,
  finiquito:this.editPagoForm.value.finiquito,
  zona10:this.editPagoForm.value.zona10,
  viatico:this.editPagoForm.value.viatico,
  asignaciones:this.editPagoForm.value.asignaciones,
  aguinaldo:this.editPagoForm.value.aguinaldo,
  finiquito_findemes:this.editPagoForm.value.finiquito_findemes
}
 console.log('body edit',body1);
 this.dtSv.get(body1).subscribe(r=>{
  //console.log('response edit',r);

  this.resetForm();
  this.closeModalEdit.nativeElement.click();
  this.getPagos();
 })
}

@ViewChild('closeModal') closeModal: ElementRef;


newPago(){
  let body ={
    tipo:"pagos",
    obra : this.obra.codigo,
    accion: 'A',
    rut : this.editPagoForm.value.rut,
    dig : this.editPagoForm.value.dig,
    nombre : this.editPagoForm.value.nombre,
    ficha : this.editPagoForm.value.ficha,
    sueldo_liq:this.editPagoForm.value.sueldo_liq,
    dias:this.editPagoForm.value.dias,
    valor_hora:this.editPagoForm.value.valor_hora,
    ajuste_pos:this.editPagoForm.value.ajuste_pos,
    anticipo:this.editPagoForm.value.anticipo,
    dctos_varios:this.editPagoForm.value.dctos_varios,
    finiquito:this.editPagoForm.value.finiquito,
    zona10:this.editPagoForm.value.zona10,
    viatico:this.editPagoForm.value.viatico,
    aguinaldo:this.editPagoForm.value.aguinaldo,
    finiquito_findemes:this.editPagoForm.value.finiquito_findemes
 }
 console.log('body new',body);
 this.dtSv.get(body).subscribe(r=>{
  console.log('response new',r);
  this.toastr.success('Trabajador creado','')
  this.resetForm();
  this.closeModal.nativeElement.click() //<-- here
  this.getPagos();

 })
}

resetForm(){
  this.editPagoForm.reset({
    ficha : '',
    sueldo_liq : 0,
    dias : 0,
    valor_hora : 0,
    asignaciones: 0,
    ajuste_pos : 0,
    anticipo : 0,
    viatico : 0,
    aguinaldo : 0,
    dctos_varios : 0,
    zona10 : 0,
    finiquito : 0
  });
}

getFormat(value){
if(value){
    return Number((value)).toLocaleString()

}else
return value
}


getTotalSueldoLiq(){
  let sueldo = 0;
  this.data.forEach((element:any)=>{
    sueldo += Number(element.sueldo_liq);

  });
  return sueldo;
}

getTotalValor_hora(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.valor_hora);

  });
  return result;
}


getTotaltotal_periodo(){
  let result = 0;
  this.data.forEach((element:any)=>{
    if(element.total_periodo){
      result += Number(element.total_periodo);

    }

  });
  return result;
}


getTotalhor_lun_sab(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.hor_lun_sab);

  });
  return result;
}

getTotalval_lun_sab(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.val_lun_sab);

  });
  return result;
}


getTotaldifer_sabado(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.difer_sabado);

  });
  return result;
}

getTotaldifer_domingo(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.difer_domingo);

  });
  return result;
}

getTotaltotal_bonos(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.total_bonos);

  });
  return result;
}

getTotalzona10(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.zona10);

  });
  return result;
}
getTotalViatico(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.viatico);

  });
  return result;
}

getTotalAguinaldo(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.aguinaldo);

  });
  return result;
}

getTotalAsignaciones(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.asignaciones);

  });
  return result;
}

getTotalajuste_pos(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.ajuste_pos);

  });
  return result;
}

getTotaltotal_ganado(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.total_ganado);

  });
  return result;
}

getTotalanticipo(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.anticipo);

  });
  return result;
}

getTotaldctos_varios(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.dctos_varios);

  });
  return result;
}

getTotala_pagar(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.dctos_varios);

  });
  return result;
}

getTotalfiniquito(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.dctos_varios);

  });
  return result;
}

getTotalliq_apagar(){
  let result = 0;
  this.data.forEach((element:any)=>{
    result += Number(element.liq_apagar);

  });
  return result;
}






}
