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
    // Because the oddsRatio is a new object each time updated w/ new uploads, we need to recalculate the list
    this.oddsRatioList = [];

    const oddsRatio: Map<Set<string>, Map<string, number>> = changes.oddsRatio.currentValue;

    oddsRatio.forEach((orEntry: Map<string, number>, key: Set<string>) => {
      // Key: set of the two types used to calculate the odds ratio
      const uiEntry = {};
      const types = Array.from(key);
      if(types.length !== 2) throw new Error('Invalid Odds ratio calculation: ' + types);

      uiEntry['type1'] = types[0];
      uiEntry['type2'] = types[1];

      uiEntry['oddsRatio'] = Number((orEntry.get(ODDS_RATIO)).toFixed(2));

      this.oddsRatioList.push(uiEntry);
    });

    // Descending sort
    this.oddsRatioList.sort(function(or1, or2) {
      return or2['oddsRatio'] - or1['oddsRatio'];
    });
  }
}

