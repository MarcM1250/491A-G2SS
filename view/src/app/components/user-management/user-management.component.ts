import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { User } from '../../models/User';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  @ViewChild(MatSort) sort: MatSort;

  users: User[];
  userError = true;

  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['username', 'organization', 'delete_permission'];
  selection = new SelectionModel<User>(true, []);

  ngOnInit() {
    this.authenticationService.getUsers().subscribe(next => {
      this.users = next;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
      this.userError = false;
    }, err => {
      console.error(err);
      this.userError = true;
    }, () => { });
  }

  showUploadForm() {
    // this.router.navigate(['/add-account']);
  }
}
