import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

// REF - https://www.youtube.com/watch?v=OVnrL4we2NM&feature=youtu.be
@Directive({
  selector: '[fileDrop]' // tslint:disable-line
})
export class FileDropDirective {
  @Output()
  filesDropped = new EventEmitter<FileList>();

  @Output()
  filesHovered = new EventEmitter();

  constructor() {
  }

  @HostListener('drop', ['$event'])
  onDrop($event) {
    $event.preventDefault();            // prevent re-direct to localUrl of that file
    const transfer = $event.dataTransfer;

    let files = transfer.files;

    // ONLY DO THIS FOR DEMO MODE - Re-assign files w/ mock data
    if (transfer !== null && transfer.getData && transfer.getData('isCustom') === 'true') {
      const data = transfer.getData('data');
      const lines = data.split('\r\n');
      const fileName = transfer.getData('fileName');
      const f = new File(lines, fileName, {type: 'text/plain'});
      const fileList = {
        0: f,
        length: 1,
        item: (index: number) => f
      };
      files = fileList;
    }
    this.filesDropped.emit(files);
    this.filesHovered.emit(false);      // On drop, user is no longer hovering
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event) {
    this.filesHovered.emit(true);
    $event.preventDefault();
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event) {
    this.filesHovered.emit(false);
  }
}
