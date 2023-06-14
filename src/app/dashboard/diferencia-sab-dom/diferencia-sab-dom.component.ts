import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { DetallePagoService } from '../detalle-pago/services/detalle-pago.service';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { DifSabDomService } from './services/dif-sab-dom.service';

@Component({
  selector: 'app-diferencia-sab-dom',
  templateUrl: './diferencia-sab-dom.component.html',
  styleUrls: ['./diferencia-sab-dom.component.css']
})
export class DiferenciaSabDomComponent implements OnInit {

  constructor(private bm: BuildMonthService, private sb: DifSabDomService, private toast : ToastrService) { }

  ngOnInit(): void {
    this.get();
    this.buildHeader();
  }

  data: any = [];
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  get() {

    let body = {
      tipo: 'finde',
      accion: 'C',
      obra: this.obra.codigo
    }
    this.sb.get(body).subscribe((r: any) => {
      this.data = r.result.sab_dom.map((value) => {

        return {
          ...value,
          isEdit: false
        }
      });
      console.log(this.data)
    })
  }

  sem: any = [];
  buildHeader() {
    let date = new Date();
    let semenas = this.bm.getWeeksInMonth(date.getFullYear(), date.getMonth());
    //console.log(semenas);
    this.sem = semenas;
  }

  saveEdit(item){
    item.isEdit = false;
    let b = {
      tipo: 'finde',
      accion: 'M',
      obra: this.obra.codigo,
      id_detalle_pagos : item.id_pagos1,
      val_sab_med : item.sab_medio_sem1,
      val_sab_ent : item.sab_entero_sem1 ,
      val_dom_med :item.dom_medio_sem1,
      val_dom_ent : item.dom_entero_sem1
    }
    console.log('body',b);
    this.sb.get(b).subscribe((r: any) => {
      console.log(r);

      this.toast.success('Actualizado con éxito',`Pago trabajador ${item.nombre}`);


    })
  }
}
