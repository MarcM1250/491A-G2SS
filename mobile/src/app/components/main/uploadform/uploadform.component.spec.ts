import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMaterialModule } from '../../../material.module';
import { FormsModule } from '@angular/forms'; 
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { UploadformComponent } from './uploadform.component';

describe('UploadformComponent', () => {
  let component: UploadformComponent;
  let fixture: ComponentFixture<UploadformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadformComponent ],
      imports: [
        CustomMaterialModule, 
        FormsModule, 
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [ { provide: MatDialogRef, useValue: {} }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
