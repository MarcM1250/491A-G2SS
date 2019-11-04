import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { ManagementService } from 'src/app/services/management.service';
import { MatDialog } from '@angular/material';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, 
              private router: Router,
              private managementService: ManagementService,
              public dialog: MatDialog,
              public dialog2: MatDialog) { }

  @ViewChild(MatSort) sort: MatSort;

  users: any[];
  userError = true;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['username', 'fullname', 'organization', 'lastlogin', 'editusers', 'editpassword'];

  ngOnInit() {
    this.authenticationService.getUsers().subscribe( retrievedUsers => {
      this.users = retrievedUsers;
      this.dataSource = new MatTableDataSource(retrievedUsers);
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
    }, () => { 
        
    });
  }

  deleteUser (uid: string) {
    this.managementService.deleteUser(uid)
    .subscribe(resp => {
      resp.code == '200'?console.log("Success"):''
    }, err => {
      console.error(err);
    }, () => { 
      let index = this.users.map ( x => { return x.uid});
      console.log("index:", index)
      this.users.splice(this.users.indexOf(index), 1);
      this.dataSource._updateChangeSubscription();
    });
  }

  goToEditUserPage(uid) {
    this.router.navigate(['/edit-account/' + uid]);
  }
  
  openNewUserDialog(): void {
    // Stores file value for use in other functions
    const dialogRef = this.dialog.open(CreateAccountComponent, {
      width: '500px',
    });

    // On closing Delete Dialog Box
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Set deleteCheck to result value
      
    });
  }

  openEditUserDialog(userid: string): void {
    const dialogRef = this.dialog.open(EditAccountComponent, {
      data: { uid : userid },
      width: '500px'
    });

    // On closing Delete Dialog Box
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Set deleteCheck to result value
      
    });
  }
}