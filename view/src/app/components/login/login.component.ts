import { Component, OnInit } from '@angular/core';

// Begin manually added code
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
// End manually added code

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  // For login
  username: string;
  password: string;

  ngOnInit() {
  }

  // Login function used in login.component.html for the login button when clicked.
  login() : void {
    if(this.username == 'admin' && this.password == 'admin'){
      this.router.navigate(["main"]);
    } else {
      alert("Invalid credentials");
    }
  }

}
