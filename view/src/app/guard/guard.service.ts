import { Injectable } from '@angular/core';
import {  CanActivate, 
          ActivatedRouteSnapshot, 
          RouterStateSnapshot, 
          Router, Route } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService, 
    private _router: Router 
  ) {}

  canActivate (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.isTokenAuthenticaded())
      return true;

    this._router.navigate(['/login']);
    return false;
  }
}