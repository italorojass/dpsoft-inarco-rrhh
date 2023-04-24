import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/login/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginSv : LoginService, private toastr : ToastrService){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (!this.loginSv.isLogged()) {
        console.log("No estás logueado");
        this.toastr.warning('NO Cuentas con credenciales activas. Desea reactivar la sesión?','Sesión expiró');
        //this.router.navigate(["/"]);
        return false;
      }
    return true;
  }

}
