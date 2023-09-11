import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-sa',
  templateUrl: './header-sa.component.html',
  styleUrls: ['./header-sa.component.css']
})
export class HeaderSaComponent {
  constructor(private router : Router) { }
  rutaLogo = 'assets/images/logo-inarco-new-removebg-preview.jpg'
  user: string = '';

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
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
    /* {
      title: 'Inicio',
      href: '/admin',
      icon: 'icon-home'
    }, */
    {
      title: 'Administración sistema',
      href : '',
      /* subitem: [
        {
          title: 'Proyectos',
          href: '/admin/proyectos',
          icon: 'icon-docs'
        },
        {
          title: 'Usuarios',
          href: '/admin/usuarios',
          icon: 'icon-people'
        },
        {
          title:'Parámetros',
          href : '/admin/parametros',
          icon : 'icon-layers'
        },
      ], */

      icon: 'icon-settings'
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
        icon : 'icon-calculator'
      }
  ]

}
