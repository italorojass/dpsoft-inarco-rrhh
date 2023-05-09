import { Component, OnInit } from '@angular/core';
import { DetallePagoService } from '../detalle-pago/services/detalle-pago.service';

@Component({
  selector: 'app-detalle-bono',
  templateUrl: './detalle-bono.component.html',
  styleUrls: ['./detalle-bono.component.css']
})
export class DetalleBonoComponent implements OnInit {

  constructor(private dtSv : DetallePagoService) { }

  ngOnInit(): void {
    this.get();
  }

  data : any=[];
  get(){
    let obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
    console.log(obra)
    let body = {
      tipo : 'bonos',
      obra : obra.codigo
    }
    this.dtSv.get(body).subscribe((r:any)=>{
        this.data = r.result.pagos;
        console.log(r.result)
    })
  }

}
