import { Component, OnInit } from '@angular/core';
import { BonosService } from './services/bonos.service';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { ToastrService } from 'ngx-toastr';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';

@Component({
  selector: 'app-detalle-bono',
  templateUrl: './detalle-bono.component.html',
  styleUrls: ['./detalle-bono.component.css']
})
export class DetalleBonoComponent implements OnInit {

  constructor(private bonoSV : BonosService,private BuildMonthService : BuildMonthService,private toast : ToastrService,private paramSV : ParametrosService) { }

  async ngOnInit() {
    await this.get();
    await this.getBonos();

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

  bonos=[];
  async getBonos(){
    let b = {
      accion : 'C',
      obra: this.obra.codigo
    }
    this.paramSV.get(b).subscribe(r=>{
      console.log(r);
      this.bonos = r['result'].bonos.map((x,i)=>{
        return {
          key : `bono${i+1}`,
          descripcion : x.descripcion.trim()
        }
      });
      console.log('response parametros',this.bonos);
      this.compare(this.bonos,this.data)
    })
  }

  getBonoValue(item,i){
    console.log('mapear nuevo bono',item);
    return `bono${i+1}`;

  }

  compare(obj1, obj2) {


    for(let prop in obj1){
      let key = prop;
      let value = obj1[prop]
      console.log(key,value)
    }


    console.log(obj2)
    let keys = [];
    for(let i = 0;i<obj2.length;i++)
    {
        Object.keys(obj2[i]).forEach(function(key){
            if(keys.indexOf(key) == -1)
            {
                keys.push(key);
            }
        });
    }
    //console.log(keys);

    for(let i=0;i<keys.length;i++){
    //  console.log(keys[i]);
      if(keys[i].includes('bono')){

        obj1.forEach(element => {
          if(element.key == keys[i]){
            console.log(keys[i]);
          }
        });
      }
    }
    /* for (const key of commonKeys) {
      if (obj1[key] !== obj2[key]) {

        return false;
      }
      console.log(obj2[key])
    } */

    return true;
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
