import { Injectable } from '@angular/core';
import {  CanActivate, 
          ActivatedRouteSnapshot, 
          RouterStateSnapshot, 
          Router, Route } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(
    private _loginservice: LoginService, 
    private _router: Router 
  ) {}

  canActivate (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._loginservice.currentToken)
      return true;

    this._router.navigate(['/login']);
    return false;
  }
}