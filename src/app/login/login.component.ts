import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginSv : LoginService,
    private router : Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  hoy = new Date().getFullYear();

  encrypt_method = 'AES-128-ECB';
  key = 'AES128encript';

  login(f:NgForm){
    console.log(f.value);
    let body = {
      "usua" : f.value.usua,
      "pass": f.value.pass
    }
    this.loginSv.login(body).subscribe((r:any)=>{
      console.log('response login',r);
      if(r.status =='ok'){
        sessionStorage.setItem('token',r['result'].token);
        sessionStorage.setItem('idUser',r['result'].id);
        sessionStorage.setItem('user',JSON.stringify(f.value.usua));
        this.router.navigate(['/obras'])
      }else{
        this.toastr.error(r.result.error_msg, 'Error al iniciar sesión');
      }

    })

  }
}
