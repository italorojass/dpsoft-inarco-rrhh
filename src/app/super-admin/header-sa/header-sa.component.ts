import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-sa',
  templateUrl: './header-sa.component.html',
  styleUrls: ['./header-sa.component.css']
})
export class HeaderSaComponent {
  constructor(private router : Router,private fb : FormBuilder) { }
  rutaLogo = 'assets/images/logo-inarco-new-removebg-preview.jpg'
  user: string = '';
  changePassForm = this.fb.group({
    actual : ['', Validators.required],
    nueva : ['', [Validators.required,Validators.minLength(6)]],
    repetir : ['',[Validators.required]]
  });
  setActive(item){
    this.router.url === item.href;
    return this.router.url === item.href ? 'active' : '';
  }
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
    this.changePassForm.setValidators(this.passwordMatchValidator);

  }
  changePass(){
    console.log('llamar al servicio!')
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('nueva').value;
    const confirmPassword = formGroup.get('repetir').value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  logout(){
    //sessionStorage.clear();
    this.router.navigate(['/login']);

  }

  toggleBar : boolean=false;
  openBars(){
    console.log('open menu')
  }

  menu = [

    {
      title: 'Ver Obras',
      href : '/obras',

      icon: 'fa fa-building'
    },
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: 'fa fa-leaf'
    },
    {
      title: 'Proyectos',
      href: '/admin/proyectos',
      icon: 'icon-briefcase'
    },
    {
      title: 'Usuarios',
      href: '/admin/usuarios',
      icon: 'icon-people'
    },
    {
      title:'Parámetros',
      href : '/admin/parametros',
      icon : 'icon-wrench'
    },
     {
        title:'Reportes',
        href : '/admin/reportes',
        icon : 'fa fa-bullseye'
      }
  ]

}
