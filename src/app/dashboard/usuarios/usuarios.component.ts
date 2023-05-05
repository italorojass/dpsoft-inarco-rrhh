import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from './services/usuarios.service';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(private userSv : UsuariosService, private fb : FormBuilder, private toastr : ToastrService) { }
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
    id: [],
    usuario : ['',Validators.required],
    nombre : ['',Validators.required],
    mail : ['',Validators.required],
    estado : ['',Validators.required],
   pass : ['',Validators.required],
   confirmPassword: ['',Validators.required]

  })

 /*  checkPasswords() {
    let pass = this.userForm.value.pass;
    let confirmPass = this.userForm.value.pass
    return pass === confirmPass ? null : { notSame: true }
  } */

clearNew(){
  this.userTitleEditModal == '';
  this.titleModal=='Nuevo';
  this.userForm.reset();
}

  titleModal = '';
  userTitleEditModal = '';
  editModal(item:any){
    this.titleModal = 'Editando';

    this.userForm.controls['pass'].clearValidators();
    this.userForm.controls['pass'].updateValueAndValidity();

    this.userForm.controls['confirmPassword'].clearValidators();
    this.userForm.controls['confirmPassword'].updateValueAndValidity();

    console.log(item);
    let bodyEdit = {
      id : item.id,
      usuario : item.usuario,
      nombre : item.nombre_usuario,
      mail: item.mail,
      pass: item.pass,
      estado : item.estado
    }
    this.userTitleEditModal = item.usuario;
    this.userForm.patchValue(bodyEdit);
  }

  @ViewChild('closeModal') closeModal: ElementRef | any
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef | any

  crearUsuario(){
    let bodyEdit = {
      usuario : this.userForm.value.usuario,
      nombre : this.userForm.value.nombre,
      mail: this.userForm.value.mail,
      pass: this.userForm.value.pass,
      estado : this.userForm.value.estado
    }
    this.userSv.crearEditUsuario(bodyEdit).subscribe((r:any)=>{
      console.log(r);
      this.toastr.success(r.result.operacion,'Crear usuario');
      this.titleModal='';
      this.userTitleEditModal = '';
      this.userForm.reset();
      this.closeModal.nativeElement.click();
      this.getUsers();

    })
  }

  saveEditUser(){
    let bodyEdit = {
      id : this.userForm.value.id,
      usuario : this.userForm.value.usuario,
      nombre : this.userForm.value.nombre,
      mail: this.userForm.value.mail,
      estado : this.userForm.value.estado
    };
    console.log(bodyEdit);
    this.userSv.crearEditUsuario(bodyEdit).subscribe((r:any)=>{
      console.log(r);
      this.toastr.success(r.result.operacion,'Editar usuario');
      this.titleModal='';
      this.userTitleEditModal = '';
      this.userForm.reset();
      this.closeModalEdit.nativeElement.click();
      this.getUsers();

    })
  }

  deleteUser(item : any){
    let body = {
      id : item.id,
      oper : '-'
    }
    this.userSv.crearEditUsuario(body).subscribe((r:any)=>{
      console.log(r);
      this.toastr.success(r.result.operacion,'Eliminar usuario');
      this.getUsers();

    })
  }

}
