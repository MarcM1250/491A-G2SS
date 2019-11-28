import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CustomMaterialModule } from '../../material.module';
import { HeaderComponent } from "../main/header/header.component";
import { UserManagementComponent } from './user-management.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;

  class MockedAuthenticationService extends AuthenticationService {
    isAdmin() { return true }
    getFirstName() { return '' }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserManagementComponent, HeaderComponent],
      imports: [
        CustomMaterialModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [ { provide: AuthenticationService, useClass: MockedAuthenticationService} ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
