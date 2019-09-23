import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/users.service';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(next => {
      console.log(next);
    }, error => {
      console.log(error);
    }, () => { });
  }

  getUsers() {

  }

}
