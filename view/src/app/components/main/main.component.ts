import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';







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
  deleteConfirm: number;
  filterSelect = 0;
  data = Object.assign(ELEMENT_DATA)
  dataSource = new MatTableDataSource<PeriodicElement> (this.data);
  displayedColumns: string[] = ['Filename', 'UploadDate', 'Uploader'];
  expandedElement: PeriodicElement | null;
  /** Selecting a row from the table----------------------- */
  selection = new SelectionModel<PeriodicElement>(true, []);


  select(x: PeriodicElement): void {
    this.selection.clear(); //Only allows one selected row (Deselects all rows)
    this.selection.toggle(x);// then selects current row
  }

  removeSelectedRows(deleteConfirm: number){
  if(deleteConfirm == 1){
    this.selection.selected.forEach(item => {
      let index: number = this.data.findIndex(d => d === item);
      console.log(this.data.findIndex(d => d === item));
      this.data.splice(index,1)
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.data);
    });
    this.selection = new SelectionModel<PeriodicElement>(true, []);
    deleteConfirm = 0;
  }
  }

  clickMethod(name: string) {
    if(confirm("Are you sure to delete "+name)) {
      console.log("Implement delete functionality here");
    }
  }

  /** End of Selection Methods --------------------------- */

  applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private router: Router ,public dialog: MatDialog) { }

  @ViewChild(MatSort) sort: MatSort; 

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  overwriteFilter(){
    //Overwrites filterPredicate to only include certain columns
    //Changed by filterMenu
    if(this.filterSelect == 0){
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.Filename.toLowerCase().includes(filter); //Only filters Filename
      };
    }
    
    if(this.filterSelect == 1){
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.UploadDate.toLowerCase().includes(filter); //Only filters Filename
      };
    }

    if(this.filterSelect == 2){
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.Uploader.toLowerCase().includes(filter); //Only filters Filename
      };
    }
  }

  logout() : void{ //Logout button redirect
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }

  upload() : void{ //Upload
    
  }

  toTop() : void{ //Scrolls to the top of the page
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

      /* When the user clicks on the button, 
    toggle between hiding and showing the dropdown content */
  myFunction() {
      document.getElementById("myDropdown").classList.toggle("show");
  }
    // Close the dropdown if the user clicks outside of it
  onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteConfirmation,{
      width: '500px',
      data: {deleteConfirm: this.deleteConfirm}
    });
    
  dialogRef.afterClosed().subscribe
  (result => {
    console.log('The dialog was closed');
    this.removeSelectedRows(result);
  }); 
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
  Filename: 'February_Report',
  UploadDate: 'March 4, 2019',
  Uploader: 'Edward T.',
  description: `Contains information collected in February`,
  filesize: `5.03 MB`,
  lastaccessed: 'March 15, 2019',
  kmlvalid: 'Success'
}, 
{
  Filename: 'March_Progress',
  UploadDate: 'March 5, 2019',
  Uploader: 'Michael S.',
  description: `Here's what we did so far`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'Success'
},
{
  Filename: 'freeminecraftnoscam.exe',
  UploadDate: 'February 6, 2019',
  Uploader: 'notch',
  description: `no scam free minecraft`,
  filesize: `2000.55gb`,
  lastaccessed: 'October 5,1997 1:50pm',
  kmlvalid: 'Failed'
},
{
  Filename: 'Real_File',
  UploadDate: 'April 1, 2019',
  Uploader: 'Jeff',
  description: `Hi`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'Success'
},
{
  Filename: 'Real_File',
  UploadDate: 'April 1, 2019',
  Uploader: 'Jeff',
  description: `Hi`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'Success'
},
{
  Filename: 'Real_File',
  UploadDate: 'April 1, 2019',
  Uploader: 'Jeff',
  description: `Hi`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'Success'
},
{
  Filename: 'Real_File',
  UploadDate: 'April 1, 2019',
  Uploader: 'Jeff',
  description: `Hi`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'Success'
},
{
  Filename: 'Real_File',
  UploadDate: 'April 1, 2019',
  Uploader: 'Jeff',
  description: `Hi`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'Success'
},
{
  Filename: 'Real_File',
  UploadDate: 'April 1, 2019',
  Uploader: 'Jeff',
  description: `Hi`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'Success'
},
{
  Filename: 'Real_File',
  UploadDate: 'April 1, 2019',
  Uploader: 'Jeff',
  description: `Hi`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'Success'
},
{
  Filename: 'Real_File',
  UploadDate: 'April 1, 2019',
  Uploader: 'Jeff',
  description: `Hi`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'Success'
},
{
  Filename: 'Real_File',
  UploadDate: 'April 1, 2019',
  Uploader: 'Jeff',
  description: `Hi`,
  filesize: `70.50gb`,
  lastaccessed: 'March 5,2019 10:50am',
  kmlvalid: 'Success'
},
];





/** For Delete Confirmation Dialog Box */
@Component({
  selector: 'delete-confirmation',
  templateUrl: 'delete-confirmation.html',

})


export class DeleteConfirmation {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmation>){
    }
    
  onNoClick(): void{
    this.dialogRef.close();
  }
}