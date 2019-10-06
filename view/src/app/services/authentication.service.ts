import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable, of, concat } from 'rxjs';

export const API_URL = 'http://localhost:3000/api';

@Injectable()

export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router) { }

  getCurrentToken(): string {
    return localStorage.getItem('token');
  }

  readToken(): Observable<string> {
    return of(this.getCurrentToken());
  }

  isTokenExpired(): boolean {
    return false;
  }

  isTokenAuthenticaded(): boolean {
    // return this.getCurrentToken() != null && !this.isTokenExpired();
    return this.getCurrentToken() != null;
  }


  /**
   * this returns the token for the user
   */
  login(username: string, password: string) {
    const getToken = this.http.post(`${API_URL}/accounts/login`, { username, password })
      .pipe(map(response => {
        if (response && response['token']) {
          localStorage.setItem('token', response['token']);
        }
      }));
    const getIsAdmin = this.http.get(`${API_URL}/accounts/${username}`).pipe(map(res => {
      localStorage.setItem('isAdmin', res['delete_permission']);
    }));
    return concat(getToken, getIsAdmin);
  }

  /**
   * returns if user is allowed to list the other users
   */
  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === '1';
  }

  getUsers(): Observable<any> {
    return this.http.get(`${API_URL}/accounts/`);
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
}
