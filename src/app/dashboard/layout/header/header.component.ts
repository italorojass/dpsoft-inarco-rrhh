import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ObraSelectService } from './../../../shared/services/obra-select.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router : Router, private ObraSelectService : ObraSelectService,
    private utils : BuildMonthService ,
    private fb : FormBuilder) { }

  user: string = '';
  obra : any= '';
  obras = [];
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
    this.obra = this.ObraSelectService.getSelected();
    this.obras =  this.ObraSelectService.get();

    let inx = this.obras.findIndex(x=>x.codigo == this.obra.codigo);
    if(inx != -1)
      this.obras.splice(inx,1);


  }

  changePassForm = this.fb.group({
    actual : ['', Validators.required],
    nueva : ['', Validators.minLength(6)],
    repetir : ['',[Validators.required],this.passwordMatchingValidatior]
  });

  changePass(){

  }

  passwordMatchingValidatior(form){
    console.log(form);
    const password = form.controls['nueva'].value;
    const confirmation = form.controls['repetir'].value;

    if (!password || !confirmation) { // if the password or confirmation has not been inserted ignore
      return null;
    }

    if (confirmation.length > 0 && confirmation !== password) {
      confirmation.setErrors({ notMatch: true }); // set the error in the confirmation input/control
    }

    return null; // always return null here since as you'd want the error displayed on the confirmation input
 };

  changeData(item){
    console.log(item);
    this.ObraSelectService.set(item);
  }

  logout(){
    //sessionStorage.clear();
    this.router.navigate(['/login']);

  }

  rutaLogo = 'assets/images/logo-inarco-new-removebg-preview.jpg';

  menu = [
    {
      title: 'Obras',
      href: '/obras',
      icon: 'icon-home'
    },

    /* {
      title: 'Pagos obra',
      //href: '/obras/inicio/requerimientos',
      icon: 'icon-briefcase',
      subitem: [
        {
          title: 'Detalle pagos',
          href: '/obras/inicio/detalle-pagos',
          icon: 'icon-docs'
        },
        {
          title: 'Horas extras',
          href: '/obras/inicio/horas-extras',
          icon: 'icon-people'
        },
        {
          title:'Diferencia sab. dom.',
          href : '/obras/inicio/diferencia-sab-dom',
          icon : 'icon-layers'
        },
        {
          title:'Detalle bonos',
          href : '/obras/inicio/detalle-bonos',
          icon : 'icon-layers'
        }],
    }, */
    {
      title: 'Pagos',
      href: '/obras/inicio/detalle-pagos',
      icon: 'icon-star'
    },
    {
      title: 'Horas extras',
      href: '/obras/inicio/horas-extras',
      icon: 'icon-clock'
    },
    {
      title:'Diferencia sab. dom.',
      href : '/obras/inicio/diferencia-sab-dom',
      icon : 'icon-vector'
    },
    {
      title:'Bonos',
      href : '/obras/inicio/detalle-bonos',
      icon : 'icon-present'
    }

  ]

  toggleBar : boolean=false;
  openBars(){
    console.log('open menu')
  }

}
