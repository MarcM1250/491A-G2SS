import { Injectable } from '@angular/core';
import { API_URL } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ManagementService {

  userManagementAPIUrl = API_URL + '/accounts/';

  constructor( private http: HttpClient ) { }

  postUserData(userData: FormData): Observable<any> {
    var object = {};
    userData.forEach( (value, key) => {
        object[key] = value;
    });    

    return this.http.post(this.userManagementAPIUrl + 'create', JSON.stringify(object), { headers: 
      { "Content-Type": "application/json" }
    });
    
  }

  updateUserData(userData: FormData): Observable<any> {
    var object = {};
    userData.forEach( (value, key) => {
        object[key] = value;
    });    
    
    return this.http.post(this.userManagementAPIUrl + 'update', JSON.stringify(object), { headers: 
      { "Content-Type": "application/json" }
    });
    
  }

  unblockuser(uid: string): Observable<any> {
    return this.http.post(this.userManagementAPIUrl + 'unblock/'+ uid, null);
  } 

  getAccount(uid: string): Observable<any> {
    return this.http.get(this.userManagementAPIUrl + 'info/'+ uid);
  } 

  deleteUser(uid: string): Observable<any> {
    return this.http.delete(this.userManagementAPIUrl + 'delete/'+ uid);
  } 
}
