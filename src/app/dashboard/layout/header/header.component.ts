import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router : Router) { }

  user: string = '';
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')!).user;
  }

  logout(){
    //sessionStorage.clear();
    this.router.navigate(['/login']);

  }

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
        }],

      icon: 'icon-settings'
    },
    {
      title: 'Requerimientos',
      href: '/obras/inicio/requerimientos',
      icon: 'icon-note'
    },
    {
      title: 'Reportes',
      href: '/obras/inicio/reportes',
      icon: 'icon-cloud-download'
    }

  ]

}
