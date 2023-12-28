import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ObraSelectService } from './../../../shared/services/obra-select.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { BuildMonthService } from 'src/app/shared/services/build-month.service';
import { UsuariosService } from 'src/app/shared/components/usuarios/services/usuarios.service';
import { ParametrosService } from 'src/app/shared/components/parametros/services/parametros.service';
import { PeriodosService } from 'src/app/shared/services/periodos.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router : Router,
    private ObraSelectService : ObraSelectService,
    private activedRoute : ActivatedRoute ,
    private fb : FormBuilder,
    private userSv: UsuariosService,
    private ToastrService : ToastrService,
    private ParametrosService : ParametrosService,
    private periodosSv : PeriodosService) { }

  user: string = '';
  rolUser :string;
  obra : any= '';
  periodos = [];

  setActive(item){
    this.router.url === item.href;
    return this.router.url === item.href ? 'active' : '';
  }
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
    this.rolUser = sessionStorage.getItem('rolUser')!;
    this.obra = this.ObraSelectService.getSelected();
    //this.periodos =  this.ObraSelectService.get();

    this.obtenerMesesAtras();

    /* let inx = this.periodos.findIndex(x=>x.codigo == this.obra.codigo);
    if(inx != -1)
      this.periodos.splice(inx,1); */

    this.changePassForm.setValidators(this.passwordMatchValidator);


  }
  datosParametros:any


  obtenerMesesAtras(){

    this.ParametrosService.get({accion:'P'}).subscribe((r:any)=>{
      //this.ObraSelectService.set(r.result.parametros.filter(x=>x.estado =='A'))
      this.datosParametros = JSON.parse(sessionStorage.getItem('datosParam'));
      this.periodos =r.result.parametros.filter(x=>x.estado != ' ');
      console.log('Total Periodos', r, this.periodos, this.datosParametros);
      //this.datosParametros.tipo_mes =='Q' || r.result.parametros[0].tipo_mes =='I' ? this.titlepage ='QUINCENA '+r.result.parametros[0].computed : this.titlepage ='FIN DE MES '+r.result.parametros[0].computed

    })
  }

  changePassForm = this.fb.group({
    actual : ['', Validators.required],
    nueva : ['', [Validators.required,Validators.minLength(6)]],
    repetir : ['',[Validators.required]]
  });

  @ViewChild('cerrarModal') cerrarModal: ElementRef<HTMLElement>;
  changePass(){
    console.log('llamar al servicio!');
    let idUser = sessionStorage.getItem('idUser');
    let body = {
      id : idUser,
      clave : this.changePassForm.value.repetir
    }

    this.userSv.cambiarClave(body).subscribe(r=>{
      this.ToastrService.success('contraseña cambiada con éxito','Cambiar contraseña');
      this.changePassForm.reset();
      this.cerrarModal.nativeElement.click();
    })
  }


 passwordMatchValidator(formGroup: FormGroup) {
  const password = formGroup.get('nueva').value;
  const confirmPassword = formGroup.get('repetir').value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

periodoSelect : any;
  changeData(item){
    console.log(item,this.router.url);
    sessionStorage.setItem('datosParam',JSON.stringify(item));
    sessionStorage.setItem('titlePage',item.quemes);
    window.location.reload();
    //this.router.navigate([this.router.url]);
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
