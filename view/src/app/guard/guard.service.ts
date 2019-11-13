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

  // tslint:disable: variable-name
  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router
  ) { }
  // tslint:enable: variable-name

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._authenticationService.isTokenValid()) {

      this._authenticationService.decodeToken();

      for (const x of next.data.role) {
        if (this._authenticationService.userInfo.role === x) {
          return true;
        }
      }
    }

    this._router.navigate(['/']);
    return false;
  }
}
