import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

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
