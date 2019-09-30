import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.css']
})
export class UploadDetailsComponent implements OnInit {
  @Input() element;
  
  constructor() { }

  ngOnInit() {
    if (this.element.file_size) {
      this.element.file_size = this.element.file_size / 1024.0
    }
  }
}
