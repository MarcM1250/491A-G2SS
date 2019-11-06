import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Upload } from '../models/Upload';
import { API_URL } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class UploadsService {

  //httpOptions = { headers: this.createHeaders() };
  uploadUrl = API_URL + '/uploads';

  // inject httpClient & authentication service into constructor
  constructor(private http: HttpClient) {
  }

  // Get All Uploads
  getUploads(): Observable<Upload[]> {
    // httpOptions.headers = httpOptions.headers.set( 'Authorization', 'Bearer ' + this.authenticationService.getCurrentToken());
    return this.http.get<Upload[]>(this.uploadUrl);
    //return this.http.get<Upload[]>(this.uploadUrl);
  }

  // Get Some Uploads
  /*
  getUploadsLimited(limitNum: Number): Observable<Upload[]> {
    // httpOptions.headers = httpOptions.headers.set( 'Authorization', 'Bearer ' + this.authenticationService.getCurrentToken());
    const url = `${this.uploadUrl}/${limitNum}`;
    return this.http.get<Upload[]>(url);
    //return this.http.get<Upload[]>(this.uploadUrl);
  }
  */
 
  // Delete Upload
  deleteUpload(upload: Upload): Observable<any> {
    const url = `${this.uploadUrl}/${upload._id}`;
    return this.http.delete(url);
  }

  postUpload(upload: FormData): Observable<any> {
    return this.http.post(this.uploadUrl, upload);
  }

  postDownload(upload: Upload): Observable<Upload> {
    const url = `${API_URL}/downloads/${upload._id}`;
    const newHttpOptions = {
      responseType: 'blob' as 'json'
      
    };
    return this.http.post<Upload>(url, {'download_via': 'Webapp'},newHttpOptions);
  }
}
