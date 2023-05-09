import { Component, OnInit } from '@angular/core';
import { DetallePagoService } from '../detalle-pago/services/detalle-pago.service';

@Component({
  selector: 'app-diferencia-sab-dom',
  templateUrl: './diferencia-sab-dom.component.html',
  styleUrls: ['./diferencia-sab-dom.component.css']
})
export class DiferenciaSabDomComponent implements OnInit {

  constructor(private dtSv : DetallePagoService) { }

  ngOnInit(): void {
    this.get();
  }

  data : any=[];
  get(){
    let obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
    console.log(obra)
    let body = {
      tipo : 'finde',
      obra : obra.codigo
    }
    this.dtSv.get(body).subscribe((r:any)=>{
        this.data = r.result.pagos;
        console.log(r.result)
    })
  }
}
