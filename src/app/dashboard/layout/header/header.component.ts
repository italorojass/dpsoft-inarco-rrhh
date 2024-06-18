import { CentralizaPeriodosService } from './../../../shared/services/centraliza-periodos.service';
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
import { Subscription, switchMap } from 'rxjs';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router,
    private ObraSelectService: ObraSelectService,
    private activedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private userSv: UsuariosService,
    private ToastrService: ToastrService,
    private ParametrosService: ParametrosService,
    private periodosSv: PeriodosService,
    private CentralizaPeriodosService: CentralizaPeriodosService,
  private spinner : NgxSpinnerService) { }

  user: string = '';
  rolUser: string;
  obra: any = '';
  periodos = [];

  setActive(item) {
    this.router.url === item.href;
    return this.router.url === item.href ? 'active' : '';
  }
  periodoActualAbierto: any = [];
  menu = []
  private subscription: Subscription;

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
    this.rolUser = sessionStorage.getItem('rolUser')!;
    this.obra = this.ObraSelectService.getSelected();

    this.menu.push({
      title: 'Obras',
      href: '/obras',
      icon: 'icon-home'
    },

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
        title: 'Diferencia sab. dom.',
        href: '/obras/inicio/diferencia-sab-dom',
        icon: 'icon-vector'
      },
      {
        title: 'Bonos',
        href: '/obras/inicio/detalle-bonos',
        icon: 'icon-present'
      });

    /*  if(!this.periodoActualAbierto){
       this.CentralizaPeriodosService.getPeriodoActivo().pipe(
         switchMap((r:any)=>{
           this.periodoActualAbierto = r.result.parametros.filter(x=>x.estado=='A')[0];
           sessionStorage.setItem('periodoAbiertoAUX',JSON.stringify(this.periodoActualAbierto));
           return this.obtenerParametros('R')
         })
       ).subscribe((r:any)=>{
         r.result.parametros.map(x=>{
           this.periodos.push(x);
         });
         this.periodos.push(this.periodoActualAbierto);
         this.menu.push({});
       })
     }else{
       this.obtenerParametros('R').subscribe((r:any)=>{
         r.result.parametros.map(x=>{
           this.periodos.push(x);
         });
         let periodoAbiertoSession = JSON.parse(sessionStorage.getItem('periodoAbiertoAUX'));
         this.periodos.push(periodoAbiertoSession);
         this.menu.push({});
       })

     } */

    this.obtenerParametros('R').subscribe((r: any) => {
      r.result.parametros.map(x => {
        this.periodos.push(x);
      });
      let periodoAbiertoSession = JSON.parse(sessionStorage.getItem('periodoAbiertoAUX'));
      this.periodos.push(periodoAbiertoSession);
      this.menu.push({});
    });
    this.periodoActualAbierto = JSON.parse(sessionStorage.getItem('periodoAbierto'));

    if (this.rolUser == '1') {
      this.menu.push({
        title: 'Administración',
        href: '/admin',
        icon: 'icon-settings'
      })
    }


    this.changePassForm.setValidators(this.passwordMatchValidator);
  }
  changeData(item) {
    this.spinner.show();
    if (item) {
      this.periodoActualAbierto = item;
      this.CentralizaPeriodosService.setPeriodoSeleccionado(item);
      setTimeout(()=>{
        window.location.reload();
    }, 100);
    }


  }


  obtenerParametros(accion) {
    return this.ParametrosService.get({ accion: accion });
  }

  changePassForm = this.fb.group({
    actual: ['', Validators.required],
    nueva: ['', [Validators.required, Validators.minLength(6)]],
    repetir: ['', [Validators.required]]
  });

  @ViewChild('cerrarModal') cerrarModal: ElementRef<HTMLElement>;
  changePass() {
    console.log('llamar al servicio!');
    let idUser = sessionStorage.getItem('idUser');
    let body = {
      id: idUser,
      clave: this.changePassForm.value.repetir
    }

    this.userSv.cambiarClave(body).subscribe(r => {
      this.ToastrService.success('contraseña cambiada con éxito', 'Cambiar contraseña');
      this.changePassForm.reset();
      this.cerrarModal.nativeElement.click();
    })
  }


  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('nueva').value;
    const confirmPassword = formGroup.get('repetir').value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  periodoSelect: any;

  logout() {
    //sessionStorage.clear();
    this.router.navigate(['/login']);

  }

  rutaLogo = 'assets/images/logo-inarco-new-removebg-preview.jpg';





  toggleBar: boolean = false;
  openBars() {
    console.log('open menu')
  }

}
