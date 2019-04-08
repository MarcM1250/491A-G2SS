import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { Router } from '@angular/router';
import {MatSort, MatTableDataSource} from '@angular/material';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'main.component',
  styleUrls: ['main.component.css'],
  templateUrl: 'main.component.html',
  animations: [ 
    trigger('detailExpand', [ //Animation for collapsing description box
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MainComponent implements OnInit  {
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['Filename', 'Upload Date', 'Uploaded By'];
  expandedElement: PeriodicElement | null;
  constructor(private router: Router) { }
  ngOnInit() {
  }
  logout() : void{ //Logout button redirect
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }
}

export interface PeriodicElement {
  Filename: string;
  'Upload Date': string;
  'Uploaded By': string;
  filesize: string;
  lastaccessed: string;
  description: string;
  kmlvalid: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Filename: 'notavirus.jpg',
    'Upload Date': 'March 4, 2019',
    'Uploaded By': 'coolfella',
    description: `yo whats up dood`,
	filesize: `5.90gb`,
	lastaccessed: 'never',
	kmlvalid: 'nuh uh'
  }, 
  {
    Filename: 'avirus.kml',
    'Upload Date': 'March 5, 2019',
    'Uploaded By': 'goodfella',
    description: `this a virus`,
	filesize: `70.50gb`,
	lastaccessed: 'March 5,2019 10:50am',
	kmlvalid: 'ye'
  },
  {
    Filename: 'freeminecraftnoscam.exe',
    'Upload Date': 'March 6, 2019',
    'Uploaded By': 'notch',
    description: `no scam free minecraft`,
	filesize: `2000.55gb`,
	lastaccessed: 'October 5,1997 1:50pm',
	kmlvalid: 'nuh uh'
  },   
];


/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */