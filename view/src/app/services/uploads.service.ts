import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Upload } from '../models/Upload';

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJ1c2VySWQiOiI1YzlhNzk3MGNmOTk5YTI4YTRjNDg4NWMiLCJpYXQiOjE1NTY0NzQxMDgsImV4cCI6MTU1NjUxMDEwOH0.yH285dx78EbOMX64M1nv5_BiZpomO71wRZ9UlW9eY-A'
    
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
