import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger, keyframes } from '@angular/animations';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material';

import { UploadsService } from '../../services/uploads.service';
import { Upload } from '../../models/Upload';
import { DatePipe } from '@angular/common';

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
    ]), // End of detailExpand trigger

  ], // End of animations
})

export class MainComponent implements OnInit {

  constructor(
    private _router: Router,
    private _uploadsService: UploadsService) {

  }

  deleteCheck: number;
  filterSelect = '';
  uploads: Upload[];
  uploadForm = false;

  dataSource: MatTableDataSource<Upload>;

  // For use in filtering file dates
  pipe: DatePipe;

  // Used for filtering by date
  fDay: string;
  fMonth: string;
  fYear: string;
  cDate: string;

  displayedColumns: string[] = ['title', 'upload_date', 'upload_by'];
  expandedElement: Upload | null;

  /** Selecting a row from the table----------------------- */
  selection = new SelectionModel<Upload>(true, []);
  /** End of Selection Methods --------------------------- */

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  select(x: Upload): void {
    this.selection.clear(); // Only allows one selected row (Deselects all rows)
    this.selection.toggle(x); // then selects current row
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
        this.dataSource.paginator = this.paginator;
        this.sort.disableClear = true;
      },
      (err) => { console.log(err); },
      () => { });
    // subcribe similar to promises .then cb: asynchronous

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyDate() {
    this.cDate = `${this.fMonth}/${this.fDay}/${this.fYear}`;
    this.dataSource.filter = this.cDate.trim().toLowerCase();
  }

  overwriteFilter() {
    this.dataSource.filter = '';
    if (this.filterSelect === 'date') {
      document.getElementById('filterBar').style.display = 'none';
      document.getElementById('filterBar1').style.display = 'flex';

      this.pipe = new DatePipe('en');
      const defaultPredicate = this.dataSource.filterPredicate;
      this.dataSource.filterPredicate = (data, filter) => {
        const formatted = this.pipe.transform(data.upload_date, 'MM/dd/yyyy');
        return formatted.indexOf(filter) >= 0 || defaultPredicate(data, filter);
      };

    } else {
      document.getElementById('filterBar').style.display = 'block';
      document.getElementById('filterBar1').style.display = 'none';
      this.dataSource.filterPredicate = (data, filter: string): boolean => {
        return data[this.filterSelect].toLowerCase().includes(filter);
      };
    }
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
            console.log('Bad Request');
          }
        },
        () => {
          this.uploads.splice(this.uploads.indexOf(upload), 1);
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
    alert(this.dataSource.filter);
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

}
