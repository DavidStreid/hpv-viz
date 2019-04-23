import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

// REF - https://www.youtube.com/watch?v=OVnrL4we2NM&feature=youtu.be
@Directive({
  selector: '[fileDrop]'
})
export class FileDropDirective {
  @Output()
  filesDropped = new EventEmitter<FileList>();

  @Output()
  filesHovered = new EventEmitter();

  constructor() {}

  @HostListener('drop', ['$event'])
  onDrop($event) {
    $event.preventDefault();    // prevent re-direct to localUrl of that file

    let transfer = $event.dataTransfer;
    this.filesDropped.emit(transfer.files);
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event) {
    event.preventDefault();
    this.filesHovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event) {
    this.filesHovered.emit(false);
  }
}
