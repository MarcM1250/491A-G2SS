import { Component, OnInit, Input } from '@angular/core';
import {  } from "../../../models/User";

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  //@Input() dataSource: MatTableDataSource<Upload>;

  constructor() { }
    first_name = '';
    last_name = '';
    organization = '';
    username = '';
    password = '';
    rePassword = '';
    errorMsg = '';

  ngOnInit() {
  }

  onSubmit(): void { // Submit file for upload
    // If Title is empty
    if (this.first_name === '' || this.last_name === '' || this.organization === '') {
        this.errorMsg = "Missing fields";
    } else { // Everything valid, Submit File
        if (this.password != this.rePassword) {
          this.errorMsg = 'Passwords don\'t match'; // No error
          this.password = '';
          this.rePassword = '';
          return;
        }
        this.errorMsg = ''; // No error
        // this.fileValid = 0;//Reset file validation

        const registerNewUser: FormData = new FormData();
        registerNewUser.append('first_name', this.first_name);
        registerNewUser.append('last_name', this.last_name);
        registerNewUser.append('organization', this.organization);
        registerNewUser.append('username', this.username);
        registerNewUser.append('password', this.password);

        /*
        this.uploadsService.postUpload(upload)
          .subscribe(
            response => {
              console.log('Server response => ', response as any);
              this.uploads.push(response.createdUpload);
            },
            err => {
              console.log('Upload failed: ', err.message);
            },
            () => {
              //this.dataSource._updateChangeSubscription();

            }
          );
        */
      }

  }

}
