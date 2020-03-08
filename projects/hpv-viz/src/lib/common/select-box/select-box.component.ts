import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

/**
 * Component that binds to parent input and emits events when toggled
 * Usage:
 *     <select-box (toggle)="{TOGGLE_FUNCTION}"
 *                 [selected]="{TOGGLE_BINDING}">
 *     </select-box>
 */


@Component({
  selector: 'select-box', // tslint:disable-line
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.css']
})
export class SelectBoxComponent implements OnInit, OnChanges {
  @Output()
  public toggle = new EventEmitter<null>();
  // Data-bound css class
  public class: string;
  @Input()
  private selected: boolean;
  private SELECTED_CLASS = 'fa checkbox fa-check-square-o';
  private NOT_SELECTED_CLASS = 'fa checkbox fa-square-o';

  constructor() {
    // Default to unselected
    this.selected = false;
    this.class = this.NOT_SELECTED_CLASS;
  }

  ngOnInit() {
    this.class = this.selected ? this.SELECTED_CLASS : this.NOT_SELECTED_CLASS;
  }

  /**
   * Parent component passing selected value should modify the css class
   */
  ngOnChanges(input: SimpleChanges): void {
    const change = input.selected;

    // Ignore change fired before initialization
    if (change.firstChange) {
      return;
    }

    const selected: boolean = change.currentValue;
    this.selected = selected;
    this.class = this.selected ? this.SELECTED_CLASS : this.NOT_SELECTED_CLASS;
  }

  /**
   * User interaction w/ the div should emit event to parent component
   */
  toggleSelect(): void {
    this.toggle.emit();
  }
}
