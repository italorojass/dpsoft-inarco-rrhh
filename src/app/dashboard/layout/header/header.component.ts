import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router : Router) { }

  user: string = '';
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
  }

  logout(){
    //sessionStorage.clear();
    this.router.navigate(['/login']);

  }

  rutaLogo = 'assets/images/logo-inarco-new-removebg-preview.jpg'

  menu = [
    {
      title: 'Inicio',
      href: '/obras/inicio',
      icon: 'icon-home'
    },
    {
      title: 'Administración sistema',
      subitem: [
        {
          title: 'Proyectos',
          href: '/obras/inicio/proyectos',
          icon: 'icon-docs'
        },
        {
          title: 'Usuarios',
          href: '/obras/inicio/usuarios',
          icon: 'icon-people'
        },
        {
          title:'Parámetros',
          href : '/obras/inicio/parametros',
          icon : 'icon-layers'
        }
      ,{
        title:'Maestro de especialidad',
        href : '/obras/inicio/maestro-especialidad',
        icon : 'icon-layers'
      }],

      icon: 'icon-settings'
    },
    {
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
    },
    {
      title: 'Reportes',
      href: '/obras/inicio/reportes',
      icon: 'icon-cloud-download'
    }

  ]

}
