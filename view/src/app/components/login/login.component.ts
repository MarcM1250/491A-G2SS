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
  username: string = 'anton';
  password: string = '123';
  timer: number = null;

  ngOnInit() { }

  // Login function used when the Login button is clicked.
  onSubmit(): void {
    this.loading = true;

    this.authenticationService.login(this.username, this.password)
      .subscribe(
        resp => {
          this.message = 'Success :)';
          this.loading = false;
          this.router.navigate(['/main']);
          
        },
        err => {

          this.authenticationService.logout();
          this.loading = false;
          this.message = err.error.message;


          if(err.error.timeleft) {

          this.timer = err.error.timeleft;
          var x = setInterval( () => {
          

          this.timer = this.timer  - 0.5;
          console.log(this.timer)
            //this.message = this.message + timer;
            if (this.timer < 0) {
              clearInterval(x);
              //this.timer = 0;
            }

          }, 500); }
        }
      );
  }
}
