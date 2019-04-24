import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Upload } from '../models/Upload';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJ1c2VySWQiOiI1YzlhNzk3MGNmOTk5YTI4YTRjNDg4NWMiLCJpYXQiOjE1NTYxNDE1MjcsImV4cCI6MTU1NjE3NzUyN30.LdbNfLDixhuU4mqoIs31jBdoaRLd6JrNavNnpdE4vD4'
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


}
