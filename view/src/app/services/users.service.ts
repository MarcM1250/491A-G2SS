import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  uploadUrl = `${API_URL}/accounts/`;

  getUsers(): Observable<any> {
    return this.http.get(this.uploadUrl);
  }
}
