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
@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {

        console.error('error intercept',error,error.status);
        this.toastr.error('', 'Error al procesar la solicitud');
        //Swal.fire('Error al procesar la solicitud',error.error.result.error_msg,'error')
        return throwError(error.message);
      })
    )
  }
}
