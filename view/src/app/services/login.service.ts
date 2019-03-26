import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  postStuff(body: any) {
    return this.http.post('http://localhost:5000/api/message', body);
  }
}
