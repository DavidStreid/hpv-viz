import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PatientOption} from "../../models/patient-option.class";

@Component({
  selector: 'type-toggle', // tslint:disable-line
  templateUrl: './type-toggle.component.html',
  styleUrls: ['./type-toggle.component.scss']
})
export class TypeToggleComponent implements OnChanges {
  @Input()
  public typeMap: Map<string, PatientOption>;

  public values: Set<String>;

  constructor() {
    this.values = new Set();
  }

  public toggle(toggle: String) {
    const opt: PatientOption = this.typeMap.get(toggle);
    opt.setSelected(!opt.isSelected());
  }

  ngOnChanges(changes: SimpleChanges): void {
    const typeMap: Map<String, PatientOption> = changes.typeMap.currentValue;
    typeMap.forEach((opt, type, map) => {
      this.values.add(type);
    }, this);
  }
}
