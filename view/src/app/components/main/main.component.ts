import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';
import { MatPaginator } from '@angular/material';

import { UploadsService } from '../../services/uploads.service';
import { Upload } from '../../models/Upload';
import { DeleteConfirmationComponent } from './delete-confirmation.component';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/services/authentication.service';

// import 'http://js.api.here.com/v3/3.0/mapsjs-data.js ';
//

@Component({
  selector: 'app-main-component',
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

  constructor(
    private _router: Router,
    private _authenticationservice: AuthenticationService,
    private _uploadsService: UploadsService,
    public dialog: MatDialog) { 
    
    }
    
  // Paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // ----------

  upload: Upload; // Holds selected file
  deleteCheck: number;
  filterSelect = "";
  uploads: Upload[];
  uploadForm: boolean = false;
  
  dataSource: MatTableDataSource<Upload>;

  // For use in filtering file dates
  pipe: DatePipe;

  displayedColumns: string[] = ['title', 'upload_date', 'upload_by'];
  expandedElement: Upload | null;

  /** Selecting a row from the table----------------------- */
  selection = new SelectionModel<Upload>(true, []);
  /** End of Selection Methods --------------------------- */

  @ViewChild(MatSort) sort: MatSort;

  select(x: Upload): void {
    this.selection.clear(); // Only allows one selected row (Deselects all rows)
    this.selection.toggle(x); // then selects current row
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.retrieveData();
  }

  /**
   * @description: Retrieves data using a subscription
   * to the _uploadsService.getUploads function :)
   * @param: none
   */

  retrieveData() {
    // get uploads from server
    this._uploadsService.getUploads().subscribe(
      response => {
        this.uploads = response.filter(x => x.delete_date === undefined);
        this.dataSource = new MatTableDataSource(this.uploads);
        this.dataSource.sort = this.sort;
      },
      (err) => { console.log(err)},
      () => { }); 
    // subcribe similar to promises .then cb: asynchronous
    
  }

  overwriteFilter() {
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      return data[this.filterSelect].toLowerCase().includes(filter);
    };
  }

  deleteUpload(upload: Upload) {
    // If user confirms Delete Confirmation box, proceed to delete
    if (this.deleteCheck === 1) {
      // delete from UI

      // delete from server
      this._uploadsService.deleteUpload(upload).subscribe(
        (response) => {
          console.log('Response from deleting: ', response);
        },
        err => {
          console.log(err);
          if (err.status === 400) {
            console.log("Bad Request")
          }
        },
        () => {
          this.uploads.splice (this.uploads.indexOf(upload), 1);
          this.dataSource._updateChangeSubscription();  
          // this.dataSource.filterPredicate = (data: Upload, filterValue: string) => data._id !== filterValue;
          // this.dataSource.filter = upload._id;
        }
      );

      // Reset deleteCheck value
      this.deleteCheck = 0;
    }
  }

  downloadFile(upload: Upload) {
    this._uploadsService.postDownload(upload).subscribe(data => {
      const downloadURL = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.target = '_blank';
      link.download = upload.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  toTop(): void { // Scrolls to the top of the page
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  showUploadForm() {
    this.uploadForm = true;
  }


  // Close the dropdown if the user clicks outside of it
  onclick = event => {
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
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '400px',
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
