import { Component, OnInit, Input } from '@angular/core';
import { ManagementService } from 'src/app/services/management.service';
import { Router } from '@angular/router';
import { MatDialogRef, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})

export class CreateAccountComponent implements OnInit {
  @Input() dataSource: MatTableDataSource<any>;

  // tslint:disable: variable-name
  constructor(
    public dialogRef: MatDialogRef<CreateAccountComponent>,
    private _managementService: ManagementService,
    private router: Router
  ) { }
  first_name = 'Firstname';
  last_name = 'Lastname';
  organization = 'CSULB';
  username = 'newuser';
  password = '123';
  rePassword = '123';
  errorMsg = '';
  // tslint:enable: variable-name

  ngOnInit() {
  }

  onSubmit(): void { // Submit file for upload
    // If Title is empty
    if (this.first_name === '' ||
      this.last_name === '' ||
      this.organization === '' ||
      this.username === '' ||
      this.password === '' ||
      this.rePassword === ''
    ) {
      this.errorMsg = 'Missing fields';
    } else {
      if (!this.checkPassword(this.password, this.rePassword)) {
        this.errorMsg = 'Passwords don\'t match'; // No error
        this.password = '';
        this.rePassword = '';
        return;
      }

      this.errorMsg = ''; // No error
      const registerNewUser = new FormData();

      registerNewUser.append('first_name', this.first_name);
      registerNewUser.append('last_name', this.last_name);
      registerNewUser.append('organization', this.organization);
      registerNewUser.append('username', this.username);
      registerNewUser.append('password', this.password);

      this._managementService.postUserData(registerNewUser)
        .subscribe(
          response => {
            console.log('Server response => ', response as any);
            this.closeDialog();
          },
          err => {
            console.log('Registration failed: ', err.message);
          }
        );

    }
  }

  checkPassword(pass1: string, pass2: string) {
    return true;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
