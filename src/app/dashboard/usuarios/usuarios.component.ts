import { Component, OnInit } from '@angular/core';
import { UsuariosService } from './services/usuarios.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(private userSv : UsuariosService, private fb : FormBuilder) { }
  userSelect:string = ''
  ngOnInit(): void {
    this.getUsers();
  }

  usuarios : any=[];
  getUsers(){
    this.userSv.get().subscribe((r:any)=>{
      console.log(r);
      this.usuarios = r['result'].usuarios;
    })
  }

  userForm = this.fb.group({
    usuario : [],
    nombre_usuario : [],
    mail : [],
    estado : []

  })
  titleModal = '';
  userTitleEditModal = '';
  editModal(item:any){
    this.titleModal = 'Editando';
    this.userTitleEditModal = item.usuario;
    this.userForm.patchValue(item);
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

}
