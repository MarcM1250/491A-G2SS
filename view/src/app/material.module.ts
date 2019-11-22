import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*
MatToolbarModule for toolbar. Contains site name and buttons.
MatCardModule and MatInputModule for login form.
MatCardModule is Material's layout and MatInputModule provides Material input fields.
*/

import {
  MatCheckboxModule, MatSelectModule,
  MatPaginatorModule, MatSortModule,
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule
} from '@angular/material';
@NgModule({
  imports: [
    MatCheckboxModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatCheckboxModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
})
export class CustomMaterialModule { }
