import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-delete-confirmation',
  templateUrl: 'delete-user-confirmation.html',
})

export class DeleteUserConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteUserConfirmationComponent>) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
