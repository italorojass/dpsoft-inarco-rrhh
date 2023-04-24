import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginSv : LoginService,
    private router : Router) { }

  ngOnInit(): void {
  }

  hoy = new Date().getFullYear();

  encrypt_method = 'AES-128-ECB';
  key = 'AES128encript';

  login(f:NgForm){
    console.log(f.value);


    var key = CryptoJS.enc.Utf8.parse(this.key);
    let passEncrypt = CryptoJS.AES.encrypt(f.value.pass.trim(),this.key,{ mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.NoPadding }).toString();

    console.log('encrypt',passEncrypt);
    /* let decrypt =  CryptoJS.AES.decrypt(passEncrypt, this.key).toString(CryptoJS.enc.Utf8);
    console.log('descrypt',decrypt); */

    let bodyEncryp = {
      usua : f.value.usua,
      pass : passEncrypt
    }
   // this.router.navigate(['/obras'])
    this.loginSv.login(bodyEncryp).subscribe(r=>{
      console.log('response login',r);
      sessionStorage.setItem('user',JSON.stringify(f.value));
      this.router.navigate(['/obras'])
    })

  }
}
