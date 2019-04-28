import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';

import { UploadsService } from '../../services/uploads.service';
import { Upload } from '../../models/Upload';

@Component({
  selector: 'main.component',
  styleUrls: ['main.component.css'],
  templateUrl: 'main.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0'})),
      state('expanded', style({ height: '*' })),
      transition('expanded => collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('collapsed => expanded', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class MainComponent implements OnInit {
  uploads:Upload[];
  dataSource = new MatTableDataSource (this.uploads);

  displayedColumns: string[] = ['Filename', 'UploadDate', 'Uploader'];
  expandedElement: PeriodicElement | null;

  subject:string;
  description:string;
  file:File;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private router: Router, private uploadsService: UploadsService ) { }

  @ViewChild(MatSort) sort: MatSort; 

  ngOnInit() {
    this.dataSource.sort = this.sort;
     // get uploads from server
     this.uploadsService.getUploads().subscribe(uploads => {
      this.uploads = uploads.filter(x => x.delete_date === undefined);
      this.dataSource = new MatTableDataSource (this.uploads);
    }); // subcribe similar to promises .then cb: asynchronous
  }

  logout() : void{ //Logout button redirect
    this.router.navigateByUrl('/login');
  }

  fileEvent($event){
    this.file = $event.target.files[0];
  }

  submitUpload(): void{ //Upload
    var upload:FormData = new FormData();
    upload.append('subject', this.subject);
    upload.append('description', this.description);
    upload.append('file', this.file);
    this.uploadsService.postUpload(upload).subscribe(upload => {
      this.uploads.push(upload); // push upload to array
    })
  }

  deleteUpload(upload:Upload){
    // delete from UI
    this.dataSource.filterPredicate = (data: Upload, filterValue: String) => data._id !== filterValue;
    this.dataSource.filter = upload._id;
    // delete from server
    this.uploadsService.deleteUpload(upload).subscribe();
  }

  downloadFile(upload:Upload){
    this.uploadsService.postDownload(upload).subscribe(data => {
      //const blob = new Blob([data], { type: 'image/png' });
      const downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = ''+upload.filename;
      link.click();
    });
  }

  toTop() : void{ //Scrolls to the top of the page
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
  
}

export interface PeriodicElement {
  Filename: string;
  UploadDate: string;
  Uploader: string;
  description: string;
  filesize: string;
  lastaccessed: string;
  kmlvalid: string;

}

const ELEMENT_DATA = [
{
  Filename: 'notavirus.jpg',
  UploadDate: 'March 4, 2019',
  Uploader: 'coolfella',
  description: `yo whats up dood`,
  filesize: `5.90gb`,
  lastaccessed: 'never',
  kmlvalid: 'nuh uh'
}, 
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},
{
  Filename: 'freeminecraftnoscam.exe',
  UploadDate: 'March 6, 2019',
  Uploader: 'notch',
  description: `no scam free minecraft`,
  filesize: `2000.55gb`,
  lastaccessed: 'October 5,1997 1:50pm',
  kmlvalid: 'nuh uh'
},
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},
{
  Filename: 'avirus.kml',
  UploadDate: 'March 5, 2019',
  Uploader: 'goodfella',
  description: `this a virus`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'ye'
},  

];







/**  Copyright 2017 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */