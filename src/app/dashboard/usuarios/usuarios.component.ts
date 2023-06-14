import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from './services/usuarios.service';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ObrasService } from '../obras/services/obras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(private userSv: UsuariosService, private fb: FormBuilder, private toastr: ToastrService, private obrasSv: ObrasService) { }
  userSelect: any = '';
  obra = JSON.parse(sessionStorage.getItem('obraSelect')!);

  ngOnInit(): void {
    this.getUsers();
  }

  usuarios: any = [];
  getUsers() {
    let b = {
      //cod_obra : this.obra.codigo,
      accion : 'C'
    }
    this.userSv.crearEditUsuario(b).subscribe((r: any) => {
      //console.log(r);
      this.usuarios = r['result'].usuarios;
    })
  }

  obrasAsociar = [];
  getObras(item) {
    this.userSelect = item;
    this.obrasAsociar=[];
    let obrasAsociads = [];
    if(item.proyectos && item.proyectos.includes(';')){
      let arr = item.proyectos.split(';')
      obrasAsociads= arr;
    }else{
      obrasAsociads.push(item.proyectos)
    }

    let b = {
      accion: 'C',
    }
    this.obrasSv.getb(b).subscribe((r: any) => {
      console.log('response obras',r, obrasAsociads);
      r['result'].obras.forEach(element => {
        if (element.estado == '1') {
         let check = obrasAsociads.find(x=>x == element.codigo);
         console.log('asociada',check);
         if(check){
          this.obrasAsociar.push({...element,isCheck : true});
         }else{
          this.obrasAsociar.push({...element,isCheck : false});
         }
        }

      });
      console.log('obras final',this.obrasAsociar);
    });

  }


  guardarObraAsociada(){
    console.log('obras a asociar',this.obrasAsociar);
    let arr= [];


    this.obrasAsociar.forEach(element => {
      if(element.isCheck){
        console.log('push asociar',element.codigo);
        arr.push(`${element.codigo}`)
      }
    });

    let b = {
      id : this.userSelect.id,
      mail : this.userSelect.mail,
      accion: 'M',
      proyectos : arr.join(';')
    }

    console.log('body guardar',b);
    this.userSv.crearEditUsuario(b).subscribe((r: any) => {
      console.log(r);
      this.closeModalAsociar.nativeElement.click();
      this.toastr.success('Obras asociadas con éxito','')
      this.getUsers()
    })
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let pass = group.get('pass').value;
    let confirmPass = group.get('confirmPassword').value
    return pass === confirmPass ? null : { notSame: true }
  }

  userForm = this.fb.group({
    id: [],
    usuario: ['', Validators.required],
    nombre: ['', Validators.required],
    mail: ['', Validators.required],
    estado: ['', Validators.required],
    pass: ['', Validators.required],
    confirmPassword: ['', Validators.required],

  },{validators: this.checkPasswords})


  clearNew() {
    this.userTitleEditModal == '';
    this.titleModal == 'Nuevo';
    this.userForm.reset();
  }

  titleModal = '';
  userTitleEditModal = '';
  editModal(item: any) {
    this.titleModal = 'Editando';

    this.userForm.controls['pass'].clearValidators();
    this.userForm.controls['pass'].updateValueAndValidity();

    this.userForm.controls['confirmPassword'].clearValidators();
    this.userForm.controls['confirmPassword'].updateValueAndValidity();

    console.log(item);
    let bodyEdit = {
      id: item.id,
      usuario: item.usuario,
      nombre: item.nombre_usuario,
      mail: item.mail,
      pass: item.pass,
      estado: item.estado,
      accion : 'M'
    }
    this.userTitleEditModal = item.usuario;
    this.userForm.patchValue(bodyEdit);
  }

  @ViewChild('closeModal') closeModal: ElementRef | any
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef | any
  @ViewChild('closeModalAsociar') closeModalAsociar: ElementRef | any
  crearUsuario() {
    let bodyEdit = {
      usuario: this.userForm.value.usuario,
      nombre: this.userForm.value.nombre,
      mail: this.userForm.value.mail,
      pass: this.userForm.value.pass,
      estado: this.userForm.value.estado,
      accion : 'A'
    }
    this.userSv.crearEditUsuario(bodyEdit).subscribe((r: any) => {
      console.log(r);
      this.toastr.success(r.result.operacion, 'Crear usuario');
      this.titleModal = '';
      this.userTitleEditModal = '';
      this.userForm.reset();
      this.closeModal.nativeElement.click();
      this.getUsers();

    })
  }

  saveEditUser() {
    let bodyEdit = {
      id: this.userForm.value.id,
      usuario: this.userForm.value.usuario,
      nombre: this.userForm.value.nombre,
      mail: this.userForm.value.mail,
      estado: this.userForm.value.estado,
      accion : 'M'
    };
    console.log(bodyEdit);
    this.userSv.crearEditUsuario(bodyEdit).subscribe((r: any) => {
      console.log(r);
      this.toastr.success(r.result.operacion, 'Editar usuario');
      this.titleModal = '';
      this.userTitleEditModal = '';
      this.userForm.reset();
      this.closeModalEdit.nativeElement.click();
      this.getUsers();

    })
  }

  deleteUser(item: any) {
    Swal.fire({
      title: `Está seguro que desea eliminar al usuario ${item.nombre_usuario}?`,

      confirmButtonText: 'Eliminar',
      text: 'El usuario será eliminado del sistema para siempre',
      icon: 'warning',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        let body = {
          id: item.id,
          accion: 'E',
          mail : item.mail
        }
        this.userSv.crearEditUsuario(body).subscribe((r: any) => {
          console.log(r);
          this.toastr.success(r.result.operacion, '');
          this.getUsers();

        })
      } else if (result.isDenied) {
        //Swal.fire('Usuario ', '', 'info')
      }
    })

  }

}
