import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManagementService } from 'src/app/services/management.service';


@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {

  constructor(
    private router: Router,
    private _managementService: ManagementService ) { }

    first_name = 'New';
    last_name = 'User';
    organization = 'CSULB';
    username = 'newuser';
    password = '123';
    rePassword = '123';
    errorMsg = '';

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
        this.errorMsg = "Missing fields";
    } else { 
        if (!this.checkPassword(this.password, this.rePassword)) {
          this.errorMsg = 'Passwords don\'t match'; // No error
          this.password = '';
          this.rePassword = '';
          return;
        }
        
        this.errorMsg = ''; // No error
        const registerNewUser  = new FormData();

        registerNewUser.append('first_name', this.first_name);
        registerNewUser.append('last_name', this.last_name);
        registerNewUser.append('organization', this.organization);
        registerNewUser.append('username', this.username);
        registerNewUser.append('password', this.password);
                
        this._managementService.postUserData(registerNewUser)
          .subscribe(
            response => {
              console.log('Server response => ', response as any);
              //this.uploads.push(response.createdUpload);
            },
            err => {
              console.log('Registration failed: ', err.message);
            },
            () => {
              //this.dataSource._updateChangeSubscription();
              this.goBack();
            }
          );
          
    }


  }

  checkPassword (pass1: string, pass2: string ){
    return true 
  }

  goBack() {
    this.router.navigate(['/user-management']);
  }

}
