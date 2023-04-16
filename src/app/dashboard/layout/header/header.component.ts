import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  user: string = '';
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')!).user;
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
          href: '/obras/administracion',
          icon: 'icon-docs'
        },
        {
          title: 'Usuarios',
          href: '/obras/usuarios',
          icon: 'icon-people'
        },
        {
          title:'Parámetros',
          href : '/obras/parametros',
          icon : 'icon-layers'
        }],

      icon: 'icon-settings'
    },
    {
      title: 'Requerimientos',
      href: '/obras/requerimientos',
      icon: 'icon-note'
    },
    {
      title: 'Reportes',
      href: '/obras/reportes',
      icon: 'icon-cloud-download'
    }

  ]

}
