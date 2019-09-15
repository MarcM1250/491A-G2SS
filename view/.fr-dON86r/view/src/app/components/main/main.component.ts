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
import { HttpClient } from "@angular/common/http";
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
    private router: Router,
    private loginService: AuthenticationService,
    private uploadsService: UploadsService,
    public dialog: MatDialog,
    private httpVar: HttpClient) { 
      this.title = '';
      this.description = '';
      
    }
    
  // Paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // ----------

  upload: Upload; // Holds selected file
  deleteCheck: number;
  filterSelect = 0;
  uploads: Upload[];

  dataSource: MatTableDataSource<Upload>;

  // For use in filtering file dates
  pipe: DatePipe;

  displayedColumns: string[] = ['title', 'upload_date', 'upload_by'];
  expandedElement: Upload | null;

  /** Selecting a row from the table----------------------- */
  selection = new SelectionModel<Upload>(true, []);
  /** End of Selection Methods --------------------------- */

  title: string;
  description: string;
  file: File;

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
   * to the uploadsService.getUploads function :)
   * @param: none
   */

  retrieveData() {
    // get uploads from server
    this.uploadsService.getUploads().subscribe(
      uploads => {
        this.uploads = uploads.filter(x => x.delete_date === undefined);
        this.dataSource = new MatTableDataSource(this.uploads);
        this.dataSource.sort = this.sort;
      }); // subcribe similar to promises .then cb: asynchronous
  }

  loadFakeData() {
    this.title = "[KML] " + Math.floor(Math.random() * 100) + "-Upload Test "+ Math.random().toString(36).replace('0.','');
      this.httpVar.get("https://baconipsum.com/api/?type=meat-and-filler&paras=1").subscribe(
          resp => {
            this.description = <any>resp;
            console.log(resp);
          }
      );
  }

  overwriteFilter() {

    // Overwrites filterPredicate to only include certain columns
    // Changed by filterMenu

    // Filter by title
    if (this.filterSelect === 0) {
      this.dataSource.filterPredicate = (data, filter: string): boolean => {
        return data.title.toLowerCase().includes(filter); // Only filters Filename
      };
    }

    // Filter by upload date
    // Year, Month, Day separately
    if (this.filterSelect === 1) {
      this.pipe = new DatePipe('en');
      const defaultPredicate = this.dataSource.filterPredicate;
      this.dataSource.filterPredicate = (data, filter) => {
        const formatted = this.pipe.transform(data.upload_date, 'MM/dd/yyyy');
        return formatted.indexOf(filter) >= 0 || defaultPredicate(data, filter);
      };
    }

    // Filter by uploader name
    if (this.filterSelect === 2) {
      this.dataSource.filterPredicate = (data, filter: string): boolean => {
        return data.upload_by.toLowerCase().includes(filter); // Only filters Filename
      };
    }
  }

  logout(): void { // Logout button redirect
    this.loginService.logout();
  }

  fileEvent($event) {
    this.file = $event.target.files[0];
  }

  goToUserPanel() {
    this.router.navigate(['/user-management']);
  }

  submitUpload(): void { // Upload
    console.log('FileType: ', this.file.type);

    if (this.isKMLfile()) {

      const upload: FormData = new FormData();
      upload.append('title', this.title);
      upload.append('description', this.description);
      upload.append('file', this.file);

      this.uploadsService.postUpload(upload)
        .subscribe(
          response => {
            console.log("Server response", <any>response.createdUpload);
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

  deleteUpload(upload: Upload) {
    // If user confirms Delete Confirmation box, proceed to delete
    if (this.deleteCheck === 1) {
      // delete from UI

      // delete from server
      this.uploadsService.deleteUpload(upload).subscribe(
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
    this.uploadsService.postDownload(upload).subscribe(data => {
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

  // When the user clicks on the button, toggle between hiding and showing the dropdown content
  // myFunction(): void {
  //   document.getElementById('myDropdown').classList.toggle('show');
  // }
  showUploadForm() {
    this.loadFakeData();
    document.getElementById('overlay').style.display = 'flex';
  }

  hideUploadForm() {
    document.getElementById('overlay').style.display = 'none';
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
