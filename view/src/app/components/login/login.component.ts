import { Component, OnInit } from '@angular/core';

// Begin manually added code
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
// import { LoginResponse } from '../../models/Login';
// End manually added code

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private message: string;
  private loading = false;

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    /*
    if (this.authenticationService.isTokenAuthenticaded()) {
      console.log('is tkn authenticated?');
      this.router.navigate(['/main']);
    }
    */
  }

  // For login
  username: string; password: string;

  ngOnInit() { }

  // Login function used when the Login button is clicked.
  onSubmit(): void {
    this.loading = true;

    this.authenticationService.login(this.username, this.password)
      .subscribe(
        resp => {
        this.message = 'Success :)';
        this.loading = false;
        console.log("Response onSubmit: ", resp)
        this.router.navigate(['/main']);
      },
        err => {
          this.authenticationService.logout();
          this.loading = false;
          this.message = 'Authentication Failed :(';
          console.error('Authentication Failed :(\n', err.status);
        }
      );
  }
}
