import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { User } from '../../models/User';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { ManagementService } from 'src/app/services/management.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, 
              private router: Router,
              private managementService: ManagementService ) { }

  @ViewChild(MatSort) sort: MatSort;

  users: User[];
  userError = true;

  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['username', 'fullname', 'organization', 'lastlogin', 'editusers', 'editpassword'];
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

  showRegistrationForm() {
    this.router.navigate(['/create-account']);
  }

  unblockUser (uid: string) {
    this.managementService.unblockuser(uid)
    .subscribe(resp => {
      resp.code == '200'?console.log("Success"):''
    }, err => {
      console.error(err);
    }, () => { });
  }
}
