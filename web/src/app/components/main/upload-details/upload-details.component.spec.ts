import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomMaterialModule } from '../../../material.module';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UploadDetailsComponent } from './upload-details.component';
import { ApiService } from '../../../services/api.service';
import { of } from 'rxjs';
import { Input } from '@angular/core';
import { analyzeAndValidateNgModules } from '@angular/compiler';

describe('UploadDetailsComponent', () => {
  let component: UploadDetailsComponent;
  let fixture: ComponentFixture<UploadDetailsComponent>;
  let expectedElement = { parser_status: ''};


  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ UploadDetailsComponent],
      imports: [ CustomMaterialModule, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDetailsComponent);
    component = fixture.componentInstance;
    component.element = expectedElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});