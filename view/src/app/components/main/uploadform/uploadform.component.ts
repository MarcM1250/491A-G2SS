import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UploadsService } from '../../../services/uploads.service';
import { HttpClient } from "@angular/common/http";
import { MatSort, MatTableDataSource } from '@angular/material';
import { Upload } from '../../../models/Upload';


@Component({
  selector: 'uploadform',
  templateUrl: './uploadform.component.html',
  styleUrls: ['./uploadform.component.css']
})

export class UploadformComponent implements OnInit {

  title: string;
  description: string;
  file: File;

  @Input() dataSource: MatTableDataSource<Upload>;
  @Input() uploads: Upload[];
  @Input() showForm: boolean;
  @Output() showFormChange = new EventEmitter();

  constructor(
    private uploadsService: UploadsService,
    private httpVar: HttpClient
  ) { 
    this.title = '';
    this.description = '';
  }

  ngOnInit() {
    this.loadFakeData();
  }

  fileEvent($event) {
    this.file = $event.target.files[0];
  }

  submitUpload(): void { // Upload
    console.log('FileType: ', this.file.type);

    if (this.file && this.isKMLfile()) {

      const upload: FormData = new FormData();
      upload.append('title', this.title);
      upload.append('description', this.description);
      upload.append('file', this.file);

      this.uploadsService.postUpload(upload)
        .subscribe(
          response => {
            console.log("Server response => ", <any>response.message);
            this.uploads.push(response.createdUpload);
          }, 
          err => {
            console.log("Upload failed: ", err.message);
          },
          () => {
            this.dataSource._updateChangeSubscription();  
            this.hideUploadForm();        
            
          }
          );

    } else {
      alert('Not a KML file :(');
    }
  }

  isKMLfile(): boolean {
    return this.file.type === 'application/vnd.google-earth.kml+xml';
  }

  hideUploadForm() {
    this.showForm = false;
    this.showFormChange.emit(this.showForm);
  }

  loadFakeData() {
    this.title = "[KML] " + Math.floor(Math.random() * 100) + "-Upload Test "+ Math.random().toString(36).replace('0.','');
      this.httpVar.get("https://baconipsum.com/api/?type=meat-and-filler&paras=1").subscribe(
          resp => {
            this.description = <any>resp;
          }
      );
  }

}
