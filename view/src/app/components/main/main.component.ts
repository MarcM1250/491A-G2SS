import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';

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
  dataSource = new MatTableDataSource (ELEMENT_DATA);
  displayedColumns: string[] = ['Filename', 'UploadDate', 'Uploader'];
  expandedElement: PeriodicElement | null;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private router: Router) { }

  @ViewChild(MatSort) sort: MatSort; 

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  logout() : void{ //Logout button redirect
    this.router.navigateByUrl('/login');
  }
  upload() : void{ //Upload
    
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

const ELEMENT_DATA: PeriodicElement[] = [
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