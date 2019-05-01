import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Upload } from '../models/Upload';

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
}
@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  uploadUrl:string = 'http://localhost:3000/api/uploads';

  // inject httpClient into constructor
  constructor(private http:HttpClient) { }

  getUploads():Observable<Upload[]> {
    return this.http.get<Upload[]>(this.uploadUrl, httpOptions);
  }

  deleteUpload(upload: Upload):Observable<Upload>{
     const url = `${this.uploadUrl}/${upload._id}`;
     return this.http.delete<Upload>(url, httpOptions);
  }

  postUpload(upload:FormData):Observable<Upload>{
    return this.http.post<Upload>(this.uploadUrl, upload, httpOptions);
  }

  postDownload(upload: Upload):Observable<Upload>{
    const url = `${'http://localhost:3000/api/downloads'}/${upload._id}`;
    const  newHttpOptions = {
      responseType: 'blob' as 'json',
      headers: httpOptions.headers
    }
    return this.http.post<Upload>(url, null, newHttpOptions);
 }
}
