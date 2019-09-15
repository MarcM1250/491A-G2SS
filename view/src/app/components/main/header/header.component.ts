import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ['.example-fill-remaining-space { flex: 1 1 auto; }']
  })

export class HeaderComponent implements OnInit {

  constructor(
    private _authenticationservice: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  
  goToUserPanel() {
    this.router.navigate(['/user-management']);
  }

  logout(): void { // Logout button redirect
    this._authenticationservice.logout();
  }
}
