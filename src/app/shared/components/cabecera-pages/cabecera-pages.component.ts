import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription, of, switchMap } from 'rxjs';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { CentralizaPeriodosService } from '../../services/centraliza-periodos.service';

@Component({
  selector: 'app-cabecera-pages',
  templateUrl: './cabecera-pages.component.html',
  styleUrls: ['./cabecera-pages.component.css']
})
export class CabeceraPagesComponent implements OnDestroy {
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);
  datosParametros: any
  @Input() titulo: string = '';
  quemesViene: any;
  @Output() _tituloComponent = new EventEmitter<any>;


  constructor(public ParametrosService: ParametrosService, private spinner: NgxSpinnerService, private periodos: CentralizaPeriodosService) {
    this.getMesAnterior();

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();

    }
  }
  private subscription: Subscription;
  getMesAnterior() {
    this.quemesViene = JSON.parse(sessionStorage.getItem('periodoAbierto'));
    if(!this.quemesViene){
      this.getMesActual().subscribe((r: any) => {
        this.quemesViene = r.result.parametros.filter(x => x.estado == 'A')[0];
        this.periodos.setPeriodoSeleccionado(this.quemesViene);
        this._tituloComponent.emit(this.quemesViene);
      }) ;
    }

  }

  getMesActual() {
    return this.periodos.getPeriodoActivo();
  }



}
