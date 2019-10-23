import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class GuardService implements CanActivate {
  
  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._authenticationService.isTokenValid()) {

      this._authenticationService.decodeToken();

      for (let x of next.data.role) {
        if (this._authenticationService.userInfo.role === x) 
          return true;
      }
    }

    this._router.navigate(['/login']);
    return false;
  }
}
