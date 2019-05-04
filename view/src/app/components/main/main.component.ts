import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator } from '@angular/material';

import { UploadsService } from '../../services/uploads.service';
import { Upload } from '../../models/Upload';


@Component({
  selector: 'main.component',
  styleUrls: ['main.component.css'],
  templateUrl: 'main.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded => collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('collapsed => expanded', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class MainComponent implements OnInit {
  // Paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;


  // ----------

  upload: Upload; // Holds selected file
  deleteCheck: number;
  filterSelect = 0;
  uploads: Upload[];
  dataSource = new MatTableDataSource(this.uploads);

  displayedColumns: string[] = ['Filename', 'UploadDate', 'Uploader'];

  title: string;
  description: string;
  file: File;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private router: Router, private uploadsService: UploadsService, public dialog: MatDialog) { }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    setTimeout(() => this.dataSource.paginator = this.paginator);

    this.dataSource.sort = this.sort;
    // get uploads from server
    this.uploadsService.getUploads().subscribe(uploads => {
      this.uploads = uploads.filter(x => x.delete_date === undefined);
      this.dataSource = new MatTableDataSource(this.uploads);
      this.dataSource.paginator = this.paginator;
    }); // subcribe similar to promises .then cb: asynchronous
  }

  overwriteFilter() {
    // Overwrites filterPredicate to only include certain columns
    // Changed by filterMenu

    // Filter by filename
    if (this.filterSelect === 0) {
      this.dataSource.filterPredicate = (data: Upload, filter: string): boolean => {
        return data.filename.toLowerCase().includes(filter); // Only filters Filename
      };
    }

    /*
    // Filter by upload date
    if(this.filterSelect == 1){
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.upload_date.toLowerCase().includes(filter); //Only filters Filename
      };
    }
    */

    // Filter by uploader name
    if (this.filterSelect === 2) {
      this.dataSource.filterPredicate = (data, filter: string): boolean => {
        return data.upload_by.toLowerCase().includes(filter); // Only filters Filename
      };
    }
  }

  logout(): void { // Logout button redirect
    this.router.navigateByUrl('/login');
  }


  fileEvent($event) {
    this.file = $event.target.files[0];
  }

  submitUpload(): void { // Upload
    const upload: FormData = new FormData();
    upload.append('title', this.title);
    upload.append('description', this.description);
    upload.append('file', this.file);
    this.uploadsService.postUpload(upload).subscribe(file => {
      this.uploads.push(file); // push upload to array
    });
  }

  deleteUpload(upload: Upload) {
    // If user confirms Delete Confirmation box, proceed to delete
    if (this.deleteCheck === 1) {
      // delete from UI
      this.dataSource.filterPredicate = (data: Upload, filterValue: string) => data._id !== filterValue;
      this.dataSource.filter = upload._id;
      // delete from server
      this.uploadsService.deleteUpload(upload).subscribe();

      // Reset deleteCheck value
      this.deleteCheck = 0;
    }
  }

  downloadFile(upload: Upload) {
    this.uploadsService.postDownload(upload).subscribe(data => {
      // const blob = new Blob([data], { type: 'image/png' });
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = '' + upload.filename;
      link.click();
    });
  }

  toTop(): void { // Scrolls to the top of the page
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  /* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
  myFunction() {
    document.getElementById('myDropdown').classList.toggle('show');
  }
  submitFunction() {
    // Hides form + Reloads page IF file is valid
    if (this.file.type === 'image/png') {
      document.getElementById('myDropdown').classList.toggle('show');
      location.reload();
    }
  }

  // Close the dropdown if the user clicks outside of it
  onclick = (event) => {
    if (!event.target.matches('.dropbtn')) {
      const dropdowns = document.getElementsByClassName('dropdown-content');
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  // On opening Delete Dialog Box
  openDialog(upload: Upload): void {
    // Stores file value for use in other functions
    this.upload = upload;
    const dialogRef = this.dialog.open(DeleteConfirmation, {
      width: '500px',
    });

    // On closing Delete Dialog Box
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      // Set deleteCheck to result value
      this.deleteCheck = result;
      this.deleteUpload(this.upload);
    });
  }
}


/** For Delete Confirmation Dialog Box */
@Component({
  selector: 'delete-confirmation',
  templateUrl: 'delete-confirmation.html',
})


export class DeleteConfirmation {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmation>) {
  }

  onNoClick(): void {
    // Closes dialog box on "No" option
    this.dialogRef.close();
  }
}



/**  Copyright 2017 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
