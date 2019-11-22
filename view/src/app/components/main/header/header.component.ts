import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ['.menu {display: flex; justify-content: flex-end; width: 100%; } .siteHeader { width: 100% }']
})

export class HeaderComponent implements OnInit {

  constructor(
    public authenticationService: AuthenticationService,
    private router: Router
    
  ) { }

  ngOnInit() {
  }

  isUserManaging() {
    return this.router.url === '/user-management';
  }

  currentPage() {
    return this.router.url;
  }

  goToUserPanel() {
    this.router.navigate(['/user-management']);
  }

  goToMainPage() {
    this.router.navigate(['/main']);
  }

  logout(): void { // Logout button redirect
    this.authenticationService.logout();
  }
}
