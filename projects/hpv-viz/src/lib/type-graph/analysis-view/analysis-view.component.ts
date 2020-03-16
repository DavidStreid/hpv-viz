import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ODDS_RATIO} from '../models/typeTracker.class';

@Component({
  selector: 'analysis-view', // tslint:disable-line
  templateUrl: './analysis-view.component.html',
  styleUrls: ['./analysis-view.component.scss']
})
export class AnalysisViewComponent implements OnChanges {
  @Input()
  oddsRatio: Map<Set<string>, Map<string, number>>;

  public oddsRatioList: Object[];

  constructor() {
    this.oddsRatioList = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const oddsRatio: Map<Set<string>, Map<string, number>> = changes.oddsRatio.currentValue;

    oddsRatio.forEach((orEntry: Map<string, number>, key: Set<string>) => {
      // Key: set of the two types used to calculate the odds ratio
      const uiEntry = {};
      const types = Array.from(key);
      if(types.length != 2) throw new Error('Invalid Odds ratio calculation: ' + types);

      uiEntry['type1'] = types[0];
      uiEntry['type2'] = types[1];
      uiEntry['oddsRatio'] = orEntry.get(ODDS_RATIO);

      this.oddsRatioList.push(uiEntry);
    });
  }
}

