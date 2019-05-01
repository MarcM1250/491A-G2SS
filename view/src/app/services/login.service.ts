import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
