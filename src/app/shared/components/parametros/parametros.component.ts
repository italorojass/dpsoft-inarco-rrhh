import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ParametrosService } from './services/parametros.service';
import { ObrasService } from 'src/app/dashboard/obras/services/obras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  nombreDias = ['Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo'];

  constructor(private fb : FormBuilder,
    private paramSV : ParametrosService,
    private ToastrService : ToastrService,
    private obras: ObrasService) { }

  formDate = this.fb.group({
    inicio : [''],
    final : [''],
    quincena : [],
    finmes : [],
    cantDias : [],
    primerDia : [],
    nombre_bono : ['']
  })
  opcionSeleccionada: string;
  obraSelect: string;
  daysTable:any=[];
  ngOnInit(): void {
    this.get();
    this.getObras();
  }

  arrobras = [];
  getObras(){

    this.obras.getb({accion : 'C'}).subscribe(r=>{
      console.log(r,r['result'].obras);
      this.arrobras = r['result'].obras.filter(x=>x.estado=='1');
      console.log(this.arrobras);
    })
  }

  cierre(tipo,msj){
    console.log(this.obraSelect);

    Swal.fire({
      title: 'Está seguro de que desea cerrar '+msj+'?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Cerrar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let body = {accion : tipo};
        console.log(body)
        this.paramSV.cierre(body).subscribe(r=>{
          console.log(r);
          this.ToastrService.success('Realizado con éxito',msj);
          /* this.obraSelect= '';
          this.opcionSeleccionada=''; */
          this.get();
        })
      } /* else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      } */
    })

   /*   */
  }

  validbtn(){
    let e = true;
    if(this.obraSelect)
      if(this.opcionSeleccionada)
        e=false;

    return e;
  }

  bonos= [];
  /* obra = JSON.parse(sessionStorage.getItem('obraSelect')); */

  paramss:any;
  get(){
    let b = {
      accion : 'C',
      obra : this.obraSelect
    }
    this.paramSV.get(b).subscribe(r=>{
      console.log(r);
      let res = r['result'].parametros;
      console.log('response parametros',res);
      this.paramss = res[0];
      /* this.bonos = r['result'].bonos;
      this.formDate.patchValue({
        inicio : res.inicio_periodo,
        final : res.final_periodo,
        cantDias : res.numero_dias,
        primerDia : res.primer_dia,
      }) */
    })
  }

  guardarBono(){
    if(this.bonos.length < 10){
      this.bonos.push({
        descripcion : this.formDate.value.nombre_bono
      });
      this.formDate.controls['nombre_bono'].reset();
    }else{
      this.ToastrService.warning('La cantidad máxima de bonos son 10','Máxima cantidad de bonos agregados')
    }

  }

  deleteBono(i){
    this.bonos.splice(i,1);
  }




}

