import { Component, OnInit } from '@angular/core';

// Begin manually added code
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { LoginResponse } from '../../models/Login';
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

  ngOnInit() { }

  // Login function used when the Login button is clicked.
  login(): void {
    this.loginService.login(this.username, this.password).subscribe(
      (data: LoginResponse) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          this.router.navigate(['main']);
        } else {
          alert(data.message);
        }
      },
      (_) => {
        alert('Invalid credentials');
      },
    );
  }
}
