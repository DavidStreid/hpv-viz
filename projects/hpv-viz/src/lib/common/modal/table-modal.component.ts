import { Component, Input, Output, OnChanges, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';

@Component({
  selector:     'table-modal', // tslint:disable-line
  templateUrl:  './table-modal.component.html',
  styleUrls:    ['./table-modal.component.scss']
})
export class TableModalComponent implements OnChanges {
  @Input()
  public hidden: boolean;
  @Input()
  public data: Object[];
  @Input()
  public headers: string[];
  @Input()
  public title: string;

  @Output()
  public closeModal = new EventEmitter<boolean>();   // Emits event of whether to close the modal

  ngOnChanges(changes: SimpleChanges) {
    const data: SimpleChange = changes['data'];
    const change: Object[] = data['currentValue'] || [];
  }

  /**
   * Fires event to parent component to close modal
   *
   * @output - event to close modal
   */
  public onClick(): void {
    this.closeModal.emit( true );
  }
}
