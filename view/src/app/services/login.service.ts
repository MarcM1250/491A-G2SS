import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User, LoginResponse } from '../models'

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post('http://localhost:3000/api/accounts/login', { username, password });
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
}
