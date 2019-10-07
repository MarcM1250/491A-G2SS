import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ['.fill-remaining-space { flex: 1 1 auto; }; siteHeader { width: 100% }']
})

export class HeaderComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  isUserManaging() {
    return this.router.url === '/user-management';
  }

  goToUserPanel() {
    this.router.navigate(['/user-management']);
  }

  goToContactPanel() {
    this.router.navigate(['/contact']);
  }

  goToMainPage() {
    this.router.navigate(['/main']);
  }

  logout(): void { // Logout button redirect
    this.authenticationService.logout();
  }
}
