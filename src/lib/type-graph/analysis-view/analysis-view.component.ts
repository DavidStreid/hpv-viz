import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MINUS_MINUS, MINUS_PLUS, ODDS_RATIO, PLUS_MINUS, PLUS_PLUS} from '../models/typeTracker.class';
import { FormGroup, FormBuilder, Validators }  from '@angular/forms';

@Component({
  selector: 'analysis-view', // tslint:disable-line
  templateUrl: './analysis-view.component.html',
  styleUrls: ['./analysis-view.component.scss']
})
export class AnalysisViewComponent implements OnChanges {
  @Input()
  oddsRatio: Map<Set<string>, Map<string, number>>;

  private filterValue: number;      // Odds Ratios with absolute values greater than @filterValue are displayed
  private oddsRatioMap: Map<Set<string>, Map<string, number>>;

  public oddsRatioFilterForm: FormGroup;
  public oddsRatioList: Object[];
  // TAB-TOGGLE CODE (copy-pasta: start)
  public show: boolean;
  public showInfo: boolean;
  public title = 'Odds Ratio';
  public toggleShow(): void{
    this.show = !this.show;
  }
  public toggleInfo(): void {
    this.showInfo = !this.showInfo;
    this.show = this.showInfo;
  }
  // TAB-TOGGLE CODE (copy-pasta: end)

  constructor(private fb: FormBuilder) {
    this.oddsRatioList = [];
    this.show = true;
    this.showInfo = false;
    this.filterValue = 5;
    this.oddsRatioMap = new Map<Set<string>, Map<string, number>>();

    this.createForm();
  }


  /**
   * Creates form w/ validations
   */
  createForm() {
    this.oddsRatioFilterForm = this.fb.group({
      oddsRatioFilter: [this.filterValue, [ Validators.required, Validators.min(0), Validators.max(10) ] ],		// Validations: Non-null
    });
  }

  /**
   * Processes update from user
   *
   * @param event
   */
  onKey(event: any) {
    const newFilter = parseFloat( event.target.value || '0' );
    this.filterValue = newFilter;
    this.oddsRatioList = this.createOddsRatioList(this.oddsRatioMap);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Because the oddsRatio is a new object each time updated w/ new uploads, we need to recalculate the list
    this.oddsRatioMap = changes.oddsRatio.currentValue;
    this.oddsRatioList = this.createOddsRatioList(this.oddsRatioMap);
  }

  /**
   * Modular filtering on the component's oddsRatioMap that's added by the user
   *
   * @param oddsRatioMap
   */
  createOddsRatioList(oddsRatioMap): Object[] {
    const oddsRatioList = [];

    oddsRatioMap.forEach((orEntry: Map<string, number>, key: Set<string>) => {
      // Key: set of the two types used to calculate the odds ratio
      const uiEntry = {};
      const types =  Array.from(key);
      if (types.length !== 2) throw new Error('Invalid Odds ratio calculation: ' + types);

      uiEntry['type1'] = types[0];
      uiEntry['type2'] = types[1];

      const orValue = orEntry.get(ODDS_RATIO);
      if(orValue > Math.abs(this.filterValue)){
        uiEntry['oddsRatio'] = Number((orValue).toFixed(2));
        uiEntry[PLUS_PLUS] = orEntry.get(PLUS_PLUS);
        uiEntry[PLUS_MINUS] = orEntry.get(PLUS_MINUS);
        uiEntry[MINUS_PLUS] = orEntry.get(MINUS_PLUS);
        uiEntry[MINUS_MINUS] = orEntry.get(MINUS_MINUS);
        oddsRatioList.push(uiEntry);
      }
    });

    // Descending sort
    oddsRatioList.sort(function (or1, or2) {
      return or2['oddsRatio'] - or1['oddsRatio'];
    });

    return oddsRatioList;
  }
}

