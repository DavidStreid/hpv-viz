import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PatientOption} from '../models/patient-option.class';

/**
 * Shows a table of patients with certain type data
 */
@Component({
  selector: 'type-summary', // tslint:disable-line
  templateUrl: './type-summary.component.html',
  styleUrls: ['./type-summary.component.scss']
})
export class TypeSummaryComponent implements OnChanges {
  @Input()
  typesMap: Map<string, PatientOption>;

  public types: Set<string>;
  public samples: Set<string>;
  public dataset: Object[];

  constructor() {
    this.typesMap = new Map();
    this.types = new Set();
    this.samples = new Set();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const typesMap: Map<string, PatientOption> = changes.typesMap.currentValue;
    const itr: IterableIterator<[string, PatientOption]> = typesMap.entries();
    let entry: IteratorResult<[string, PatientOption]> = itr.next();
    let type, opt, data;
    while (!entry.done) {
      type = entry.value[0];
      opt = entry.value[1];
      data = opt.getData();

      for (const sample of Array.from(data)) {
        this.samples.add(sample);
      }
      this.types.add(type);

      entry = itr.next();
    }
  }

  public hasType(type: string, sample: string): boolean {
    return this.typesMap.get(type).getData().has(sample)
  }
}
