import { Component, OnInit } from '@angular/core';

// Begin manually added code
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
// End manually added code

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private loginService: LoginService) { }

  // For login
  username: string;
  password: string;

  ngOnInit() {
    // this.loginService.getStuff();
  }

  // Function that tests the connection to the Express backend
  testDB(success: boolean) {
    let body = {};
    if (success) {
      body = {
        test: "admin logged in"
      }
    } else {
      body = {
        test: "invalid credentials"
      }
    }
    this.loginService.postStuff(body).subscribe((data: any) => {
      console.log(data);
    });
  }

  // Login function used in login.component.html for the login button when clicked.
  login(): void {
    if (this.username == 'admin' && this.password == 'admin') {
      this.testDB(true);
      this.router.navigate(["main"]);
    } else {
      this.testDB(false);
      alert("Invalid credentials");
    }
  }
}
