import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  constructor() { }

  username = '';
  password = '';
  rePassword = '';
  adminPowers = false;

  ngOnInit() {
  }

  onSubmit() {
    console.log(`Username: ${this.username}\nPassword: ${this.password}\nRePassword: ${this.rePassword}\nAdminPowers: ${this.adminPowers}`);
  }

}
