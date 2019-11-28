import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { CountdownComponent } from "./countdown.component";

import { AuthenticationService } from "../../services/authentication.service";
import { CustomMaterialModule } from '../../material.module';
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms'; 
import { Observable, of } from 'rxjs';

class MockedAuthenticationService extends AuthenticationService {

  login() {
    return new Observable<void>()
  }
}

const fakeStub = {
  get() {
    return of([])
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, CountdownComponent],
      imports:[
        CustomMaterialModule,
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthenticationService, useValue: ''} 
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
