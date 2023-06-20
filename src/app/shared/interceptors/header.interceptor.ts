import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const userToken = sessionStorage.getItem('token');
    const modifiedReq = request.clone({
      headers: request.headers.set('token', `${userToken}`),
    });
    return next.handle(modifiedReq);
  }
}
