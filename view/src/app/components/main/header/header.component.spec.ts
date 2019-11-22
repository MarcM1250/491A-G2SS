import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomMaterialModule } from '../../../material.module';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HeaderComponent } from './header.component';

class MockedAuthenticationService extends AuthenticationService {
  isAdmin() {
    return true;
  }

  getFirstName() {
    return '';
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [ CustomMaterialModule, RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: AuthenticationService, useClass: MockedAuthenticationService} ]
     // providers: [ { provide: AuthenticationService, useClass: fakeService} ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  

});
