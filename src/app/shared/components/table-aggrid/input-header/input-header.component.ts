import { Component } from '@angular/core';
import { IHeaderParams } from 'ag-grid-community';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { FormBuilder } from '@angular/forms';
import { BonosService } from 'src/app/dashboard/detalle-bono/services/bonos.service';
import { ToastrService } from 'ngx-toastr';
import { InputHeaderService } from './input-header.service';

@Component({
  selector: 'app-input-header',
  templateUrl: './input-header.component.html',
  styleUrls: ['./input-header.component.css']
})
export class InputHeaderComponent implements IHeaderAngularComp {

  constructor(private fb : FormBuilder,
    private inputSv : InputHeaderService,
    private bonos : BonosService,
    private toastr : ToastrService){}

  form = this.fb.group({
    inputValue: [''],
  });
  public params!: IHeaderParams;

  agInit(params: IHeaderParams): void {
    this.params = params;
    this.form.patchValue({inputValue : this.params['label']});
    console.log(params);
    let replace = this.params.displayName.replace('Bono','nombre');

    this.inputSv.bod[replace] = this.form.value.inputValue ?  this.form.value.inputValue: '';
  }

  refresh(params: IHeaderParams) {
    //console.log('refresh',params);
    return true;
  }

  changef(){
    console.log('change f',this.params, this.inputSv.bod);

    let replace = this.params.displayName.replace('Bono','nombre');

    this.inputSv.bod[replace] = this.form.value.inputValue;


    console.log('guardar',this.inputSv.bod);

    this.bonos.insert(this.inputSv.bod).subscribe(r=>{
      this.toastr.success('Guardado con éxito','Bono '+this.form.value.inputValue);

    })
  }
}
