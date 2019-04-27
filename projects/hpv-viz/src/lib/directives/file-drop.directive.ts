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
    $event.preventDefault();            // prevent re-direct to localUrl of that file

    const transfer = $event.dataTransfer;
    this.filesDropped.emit(transfer.files);
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
