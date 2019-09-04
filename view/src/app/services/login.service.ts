import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { map } from 'rxjs/operators';

export const API_URL = "http://localhost:3000/api";

@Injectable()

export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }

  public get currentToken(): any {
    console.log("Token: ", localStorage.getItem('token'));
    return localStorage.getItem('token');
  }

  login(username: string, password: string) {
    return this.http.post('http://localhost:3000/api/accounts/login', { username, password })
      .pipe(map(response => {
        if (response && response['token']) {
            localStorage.setItem('token', response['token']);
        }

    }))
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
