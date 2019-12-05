import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-delete-confirmation',
  templateUrl: 'delete-confirmation.html',
})

export class DeleteConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
