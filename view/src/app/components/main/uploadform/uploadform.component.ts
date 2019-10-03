import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UploadsService } from '../../../services/uploads.service';
import { HttpClient } from '@angular/common/http';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Upload } from '../../../models/Upload';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-uploadform',
  templateUrl: './uploadform.component.html',
  styleUrls: ['./uploadform.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({})),
      state('expanded', style({ height: '*' })),
      transition('expanded => collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],


})


export class UploadformComponent implements OnInit {

  title: string;
  description: string;
  file: File;
  fileValid = 0;
  errorMsg: string;
  newStyle: string;

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
    this.fileValid = 1;
  }


  submitUpload(): void { // Submit file for upload
    // If Title is empty
    if (this.title === '') {
      this.errorMsg = 'Title field is empty';
    } else if (this.description === '') {
      this.errorMsg = 'Description field is empty';
    } else if (this.fileValid === 0) {
      this.errorMsg = 'No file selected';
    } else if (this.isKMLfile()) {
      // Maximum File Size Limit
      if (this.file.size / 1024 > 10000) { // File Size Limit: 10MB
        this.errorMsg = 'File size of 10MB exceeded, please choose another file';
        const audio = new Audio();
        audio.src = '../../assets/alarm.wav';
        audio.load();
        audio.play();
      } else { // Everything valid, Submit File
        this.errorMsg = ''; // No error
        // this.fileValid = 0;//Reset file validation

        const upload: FormData = new FormData();
        upload.append('title', this.title);
        upload.append('description', this.description);
        upload.append('file', this.file);

        this.uploadsService.postUpload(upload)
          .subscribe(
            response => {
              console.log('Server response => ', response as any);
              this.uploads.push(response.createdUpload);
            },
            err => {
              console.log('Upload failed: ', err.message);
            },
            () => {
              this.dataSource._updateChangeSubscription();
              this.hideUploadForm();

            }
          );
      }
    } else { // Not a KML file
      this.errorMsg = 'Invalid File Type';
    }
  }

  isKMLfile(): boolean {
    return this.file.name.substr(this.file.name.lastIndexOf('.') + 1) === 'kml';
  }

  hideUploadForm() {
    this.newStyle = 'slideout 0.5s';
    setTimeout(() => {
      this.showForm = false;
      this.showFormChange.emit(this.showForm);
    }, 450);
  }

  // Auto inputs test data for Title and Description
  loadFakeData() {
    this.title = `[KML] ${Math.floor(Math.random() * 100)}-Upload Test ${Math.random().toString(36).replace('0.', '')}`;
    this.httpVar.get('https://baconipsum.com/api/?type=meat-and-filler&paras=1').subscribe(
      resp => {
        this.description = resp as any;
      }
    );
  }

}
