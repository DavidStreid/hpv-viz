import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Toggle} from '../models/patient-option.class';

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
  typesMap: Map<String, Toggle>;

  public types: Set<String>;
  public samples: Set<String>;
  public dataset: Object[];

  constructor() {
    this.typesMap = new Map();
    this.types = new Set();
    this.samples = new Set();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const typesMap: Map<String, Toggle> = changes.typesMap.currentValue;
    const itr: IterableIterator<[String, Toggle]> = typesMap.entries();
    let entry: IteratorResult<[String, Toggle]> = itr.next();
    let type, opt, data;
    while (!entry.done) {
      type = entry.value[0];
      opt = entry.value[1];
      data = opt.getData();

      this.types.add(type);

      const sampleItr: IterableIterator<String> = data.values();
      let sample = sampleItr.next();
      while (!sample.done) {
        this.samples.add(sample.value);
        sample = sampleItr.next();
      }

      entry = itr.next();
    }
  }

  public hasType(type: String, sample: String): boolean {
    return this.typesMap.get(type).getData().has(sample);
  }
}
