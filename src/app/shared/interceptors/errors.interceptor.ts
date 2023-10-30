import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from'sweetalert2';
import { Router } from '@angular/router';
@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService, private router : Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {

        console.error('error intercept',error);
        if(error.status ==0){
          this.toastr.error(`Sin conexión de VPN`,'Error de conexión' );
          this.router.navigate(['/']);
        }else{
          this.toastr.error(`${error.error.error}`,'Error en la solicitud' );

        }
        //Swal.fire('Error al procesar la solicitud',error.error.result.error_msg,'error')
        return throwError(()=>console.log(error.message));
      })
    )
  }
}
