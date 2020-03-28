import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Toggle} from '../../models/patient-option.class';

@Component({
  selector: 'type-toggle', // tslint:disable-line
  templateUrl: './type-toggle.component.html',
  styleUrls: ['./type-toggle.component.scss']
})
export class TypeToggleComponent implements OnChanges {
  @Input()
  public typeMap: Map<String, Toggle>;
  @Output()
  public toggleEvent = new EventEmitter<String>();

  public values: Set<String>;

  constructor() {
    this.values = new Set();
  }

  public toggle(toggle: String) {
    const opt: Toggle = this.typeMap.get(toggle);
    opt.setSelected(!opt.isSelected());

    this.toggleEvent.emit(toggle);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const typeMap: Map<String, Toggle> = changes.typeMap.currentValue;
    typeMap.forEach((opt, type, map) => {
      if (type) { this.values.add(type); }    // Add all non-null, defined values
    }, this);
  }
}
