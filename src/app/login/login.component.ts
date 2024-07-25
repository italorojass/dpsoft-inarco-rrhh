import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginSv : LoginService,
    private router : Router,
    private toastr: ToastrService,
    private cookieService: CookieService) { }

  ngOnInit(): void {
    sessionStorage.clear();
  }

  hoy = new Date().getFullYear();


  login(f:NgForm){
    console.log(f.value);
    let body = {
      usua : f.value.usua,
      pass: f.value.pass,
      accion : 'C'
    }
    this.loginSv.login(body).subscribe((r:any)=>{
      console.log('response login',r);
      if(r.status =='ok'){
        sessionStorage.setItem('token',r['result'].token);
        sessionStorage.setItem('idUser',r['result'].id_usuario);
        this.cookieService.set('rolUser',r['result'].tipo)

        if(r['result'].obras.length > 0){
          sessionStorage.setItem('obras',JSON.stringify(r['result'].obras));
          sessionStorage.setItem('user',JSON.stringify(f.value.usua));
          sessionStorage.setItem('rolUser',r['result'].tipo);

          if(r['result'].tipo =="0") {//0=usuario, 1 es admin
            this.router.navigate(['/obras'])
          }else{
            //aca mostrar modal
            this.showModalMultiROLE()
            //this.router.navigate(['/admin'])
          }


        }else{
          this.toastr.error(r['result'].obras, 'Sin obras asociadas');
        }


      }else{
        this.toastr.error(r.result.error_msg, 'Error al iniciar sesión');
      }

    })

  }

  showModalMultiROLE() {

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-default',
            cancelButton: 'btn btn-primary'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: '¿Como desea continuar?',
        text: "Esta cuenta puede acceder a todo el contenido del portal. ¿Como desea continuar su navegación?",
        icon: 'info',
        showCancelButton: true,

        confirmButtonText: 'Administración',
        cancelButtonText: 'Ver obras'
    }).then((result) => {
        if (result.value) {//superadmin

          this.router.navigate(['/admin/proyectos']);
            //this.router.navigate(['/admin/dashboard']);

        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {//usuario

          this.router.navigate(['/obras']);
        }
    })
}


}
