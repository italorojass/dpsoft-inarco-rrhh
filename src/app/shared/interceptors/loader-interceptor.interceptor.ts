import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoaderInterceptorInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  constructor(private loadingService: LoaderService,
    private spinner : NgxSpinnerService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //console.log('caught')
    this.totalRequests++;
    this.spinner.show();
    //this.loadingService.setLoading(true);
    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests == 0) {
          this.spinner.hide();
         //this.loadingService.setLoading(false);
        }
      })
    );
  }
}
