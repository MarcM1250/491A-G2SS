import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ManagementService } from 'src/app/services/management.service';
import { MatDialog } from '@angular/material';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { DeleteUserConfirmationComponent } from './edit-account/delete-user-confirmation.component';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private managementService: ManagementService,
    public dialog: MatDialog) { }

  @ViewChild(MatSort) sort: MatSort;

  users: any[];
  userError = true;
  deleteCheck: boolean;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['username', 'fullname', 'organization', 'lastlogin', 'editusers', 'editpassword'];

  ngOnInit() {
    this.getArrayUsers();
  }

  getArrayUsers() {
    this.authenticationService.getUsers().subscribe(retrievedUsers => {
      this.users = retrievedUsers;
      this.dataSource = new MatTableDataSource(retrievedUsers);
      this.dataSource.sort = this.sort;
      this.userError = false;
    }, err => {
      console.error(err);
      this.userError = true;
    });
  }

  unblockUser(uid: string) {
    this.managementService.unblockuser(uid)
      .subscribe(resp => {
        if (resp.code === '200') {
          console.log('Success');
        }
        this.getArrayUsers();
      }, err => {
        console.error(err);
      });
  }

  openDeleteUserConfirmation(userId: string): void {
    const dialogRef = this.dialog.open(DeleteUserConfirmationComponent, {
      width: '260px',
    });

    // On closing Delete Dialog Box
    dialogRef.afterClosed().subscribe(result => {
      this.deleteCheck = result;
      this.deleteUser(userId);
    });
  }

  deleteUser(uid: string) {
    if (this.deleteCheck === true) {

      this.managementService.deleteUser(uid)
        .subscribe(resp => {
          if (resp.code === '200') {
            console.log('Success');
          }
        }, err => {
          console.error(err);
        }, () => {
          // let user = this.users.map ( x => { return x._id==uid?x:'' });
          // this.users.splice(this.users.indexOf(user), 1);
          this.users.splice(this.users.findIndex(x => x._id === uid), 1);
          this.dataSource._updateChangeSubscription();
        });
    }
    this.deleteCheck = false;
  }

  openNewUserDialog(): void {

    const dialogRef = this.dialog.open(CreateAccountComponent, {
      width: '500px',
    });

    // On closing Delete Dialog Box
    dialogRef.afterClosed().subscribe(_ => {
      this.getArrayUsers();
    });
  }

  openEditUserDialog(userid: string): void {
    const dialogRef = this.dialog.open(EditAccountComponent, {
      data: { uid: userid },
      width: '500px'
    });

    // On closing Delete Dialog Box
    dialogRef.afterClosed().subscribe(_ => {
      this.getArrayUsers();
    });
  }
}
