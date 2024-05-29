import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ObrasService } from 'src/app/dashboard/obras/services/obras.service';
import { UsuariosService } from './services/usuarios.service';
import { GuiColumn, GuiColumnMenu, GuiRowSelection, GuiSorting, GuiSummaries } from '@generic-ui/ngx-grid';
import { ColDef, GridReadyEvent, ICellEditorParams } from 'ag-grid-community';
import { AgGridSpanishService } from '../../services/ag-grid-spanish.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ButtonCellRendererComponent } from '../button-cell-renderer/button-cell-renderer.component';
import { PassDataService } from '../button-cell-renderer/services/pass-data.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  @ViewChild('Grid') agGrid: AgGridAngular;

  constructor(private userSv: UsuariosService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private obrasSv: ObrasService,
    private aggsv : AgGridSpanishService,
    private passData : PassDataService) { }
  userSelect: any = '';

  ngOnInit(): void {
    this.getUsers();

    if(this.passData.dataEdit){
      this.passData.dataEdit.subscribe(valueEdit=>{
        console.log('click edit ',valueEdit);
        switch(valueEdit['accion']){
          case 'asoc':
            this.getObras(valueEdit['data']);
            break;
          case 'edit':
            this.editModal(valueEdit['data'])
          break;
          case 'delete':
          this.deleteUser(valueEdit['data'])
          break;
        }

        //this.getObras(valueEdit)
      })
    }

  }

  overlayLoadingTemplate = this.aggsv.overlayLoadingTemplate;
  overlayNoRowsTemplate = this.aggsv.overlayNoRowsTemplate;
  localeText = this.aggsv.getLocale();
cellCellEditorParams = (params: ICellEditorParams<any>) => {
   //
   const selectedCountry = params.data.id;
   console.log('SELECTED', selectedCountry);
   let keys=['Activo','Inactivo']

  return {
    values: keys,
    formatValue: (value) => `${value} (${selectedCountry})`,
  };
  };

  defaultColDef: ColDef = {
    resizable: true,
    initialWidth: 200,
    editable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,


  };
  columnDefs:ColDef[] = [ {
    headerName: 'ID',
    field: 'correlativo',
    filter: false,
    floatingFilter: false,
    editable : false
  },
  {
    headerName: 'Nombre usuario',
    field: 'nombre_usuario',
    filter: false,
    floatingFilter: false,
    editable : false
  },
  {
    headerName: 'Usuario',
    field: 'usuario',
    filter: false,
    floatingFilter: false,
    editable : false
  },
  {
    headerName: 'Email',
    field: 'mail',
    filter: false,
    width : 250,
    floatingFilter: false,
    editable : false
  },
  {
    headerName: 'Estado',
    field: 'estado',
    filter: false,
    floatingFilter: false,
    editable : false,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: this.cellCellEditorParams,
    cellClass: params =>{return this.cellClas(params.value)},


  },
  {
      headerName: 'Acciones',
      cellRenderer: ButtonCellRendererComponent,
      cellRendererParams: {
        clicked: (field: any) => {
          console.log('item click', field);
        }
      },
      filter: false,
      floatingFilter: false,
      width: 600,
      autoHeight: true,
      editable : false
    },
];

onGridReady(params: GridReadyEvent<any>) {
/*   this.gridApi = params.api;
  this.grid.api = params.api */
}


cellClas(params){

  return params ==='Activo' ? 'badge badge-success': 'badge badge-danger'
}



  usuarios: any = [];
  getUsers() {
    let b = {
      //cod_obra : this.obra.codigo,
      accion : 'C'
    }
    console.log('body usuraios get',b)
    this.userSv.crearEditUsuario(b).subscribe((r: any) => {
      console.log(r);

      this.usuarios = r['result'].usuarios.map((x,i)=>{
        return {
          ...x,
          correlativo : i+1
        }
      });
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
    firma : [''],
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
      firma : item.firma,
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
      firma : this.userForm.value.firma,
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
      firma : this.userForm.value.firma,
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
      text: 'El usuario será eliminado del sistema, esta acción es irreversible!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
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

      }
    })

  }

}
