import { Component, OnInit } from '@angular/core';
import { BonosService } from './services/bonos.service';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalle-bono',
  templateUrl: './detalle-bono.component.html',
  styleUrls: ['./detalle-bono.component.css']
})
export class DetalleBonoComponent implements OnInit {

  constructor(private bonoSV : BonosService,private BuildMonthService : BuildMonthService,private toast : ToastrService) { }

  ngOnInit(): void {
    this.get();
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
        this.data = r.result.bonos.map((value) => {

          return {
            ...value,
            isEdit: false
          }
        });

        console.log(this.data)
    })
  }

  formatRut(rut,dig){

    return this.BuildMonthService.formatRut(rut,dig);
  }

  saveEdit(item){
    item.isEdit = false;
    let b = {
      tipo: 'bonos',
      accion: 'M',
      obra: this.obra.codigo,
     ...item
    }
    console.log('body',b);
    this.bonoSV.get(b).subscribe((r: any) => {
      console.log(r);
      let reemplazar = this.data.findIndex(x=>x.id == r['result'].bonos[0].id);
      this.data[reemplazar] = r['result'].bonos[0];
      this.toast.success('Actualizado con éxito',`Bono de ${item.nombre}`);


    })
  }


}
