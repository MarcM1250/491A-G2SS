import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Upload } from '../../../models/upload.model';
import { UploadsService } from '../../../services/uploads.service';
import { DeleteConfirmationComponent } from './delete-confirmation.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.css']
})
export class UploadDetailsComponent implements OnInit {
  @Input() uploads: Upload[];
  @Input() element;
  @Input() dataSource: MatTableDataSource<Upload>;
  upload: Upload; // Holds selected file

  deleteCheck: number;

  constructor(
    private _uploadsService: UploadsService,
    public dialog: MatDialog) { }

  ngOnInit() {
  }

  deleteUpload(upload: Upload) {
    // If user confirms Delete Confirmation box, proceed to delete
    if (this.deleteCheck === 1) {

      // delete from server
      this._uploadsService.deleteUpload(upload).subscribe(
        (response) => {         
          // delete from UI
          this.uploads.splice(this.uploads.indexOf(upload), 1);
          this.dataSource._updateChangeSubscription();
          console.log('Response from deleting: ', response);
        },
        err => {
          console.log(err);
          if (err.status === 400) {
            console.log("Bad Request")
          }
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

  // On opening Delete Dialog Box
  openDialog(upload: Upload): void {
    // Stores file value for use in other functions
    this.upload = upload;
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '260px',
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
