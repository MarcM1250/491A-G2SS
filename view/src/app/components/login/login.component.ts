import { Component, OnInit } from '@angular/core';

// Begin manually added code
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
//import { LoginResponse } from '../../models/Login';
// End manually added code

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private loginService: LoginService) { 
    if (this.loginService.currentToken) { 
      console.log("Yay");
      this.router.navigate(['/main']);
  }

}

  // For login
  username: string;
  password: string;

  ngOnInit() { }

  // Login function used when the Login button is clicked.
  onSubmit(): void {
    this.loginService.login(this.username, this.password)
        .subscribe(
            data => {
              this.router.navigate(['/main']);              
            },
            err => {          
              alert(err)
            ;
      }
    ); 
  }
}
