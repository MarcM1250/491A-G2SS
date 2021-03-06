import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable, of, concat, throwError } from 'rxjs';
import { User } from '../models/User';

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
    return this.http.post(`${API_URL}/accounts/login`, { username, password }).pipe(map(response => {
      if (response) {
        if (response.hasOwnProperty('token') && response.hasOwnProperty('delete_permission')) {
          localStorage.setItem('token', response['token']);
          localStorage.setItem('isAdmin', response['delete_permission']);
        }
      }
    }));
  }

  /**
   * returns if user is allowed to list the other users
   */
  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
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

  /**
   * Removes the need for greedy logouts when not asked for.
   * If a user is not allowed to access an admin route, it will boot them to main where they belong, else, log them out
   */
  boot(): void {
    if (localStorage.length === 0) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['main']);
    }
  }

  removeLocalToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
  }
}
