import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  currentUpload: Object;
  dropzoneActive: boolean = false;

  constructor() { }

  ngOnInit() {}

  dropzoneState($event: boolean) {
    console.log($event);
    this.dropzoneActive = $event;
  }

  handleDrop(fileList: FileList) {
  }
}
