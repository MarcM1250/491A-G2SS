import { environment } from "../../environments/environment";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable, of, concat, throwError } from 'rxjs';
import { User } from '../models/user.model';
import decode from 'jwt-decode';

export const API_URL = 'http://localhost:3000/api';

@Injectable()

export class AuthenticationService {
  
  userInfo: { first_name : string, role : string };

  constructor(private http: HttpClient, private router: Router) { 
    //this.decodeToken();
  }

  getCurrentToken() {
    return localStorage.getItem('token');
  }

  getFirstName():string {
    return this.userInfo.first_name;
  }
  //! TODO: Validate tkn
  isTokenValid(): boolean {
    return this.isThereAToken();
  }

  isThereAToken(): boolean {
    // return this.getCurrentToken() != null && !this.isTokenExpired();
    return this.getCurrentToken() != null;
  }

  /**
   * this returns the token for the user
   */
  login(username: string, password: string) {
    return this.http.post(`${API_URL}/accounts/login`, { username, password }).pipe(map(response => {
      if (response) {
        if (response.hasOwnProperty('token')) {
          localStorage.setItem('token', response['token']);
        }
      }
    }));
  }

  isAdmin(): boolean {
    return this.userInfo.role === 'admin';
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}/accounts/`);
  }

  /**
   * this delete token form localStorage
   * and redirects browser to login page
   */

  logout(): void {
    this.removeLocalToken();
    this.router.navigate(['/login']);
  }

  removeLocalToken(): void {
    localStorage.removeItem('token');
  }

  decodeToken(): void {
    this.userInfo = decode(this.getCurrentToken());
    //console.table(this.userInfo);
  }

}
