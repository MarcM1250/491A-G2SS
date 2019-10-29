import { Injectable } from '@angular/core';
import { API_URL } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ManagementService {

  createUserUrl = API_URL + '/accounts/';

  constructor( private http: HttpClient ) { 
  }

  postUserData(userData: FormData): Observable<any> {
    return this.http.post(this.createUserUrl + 'create', userData);
  }
}
