import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  login(body: any) {
    return this.http.post('http://localhost:3000/api/accounts/login', body);
  }
}
