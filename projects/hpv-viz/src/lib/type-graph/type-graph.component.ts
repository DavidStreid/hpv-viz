import { Component, OnInit } from '@angular/core';
import { HpvDataService } from '../services/hpv-data-service';
import { DateOpt } from './graph-options.enums';

@Component({
  selector:      'app-type-graph',
  templateUrl:  './type-graph.component.html',
  styleUrls:    ['./type-graph.component.css'],
  providers:    [ HpvDataService ]
})
export class TypeGraphComponent implements OnInit {
  public hpvPatientData: Object[];
  public dataSelectors: Object = {
    [DateOpt.MIN_SEC]:  { label: 'Min',   selector: DateOpt.MIN_SEC,  selected: false,  enabled: false },
    [DateOpt.HOUR]:     { label: 'Hour',  selector: DateOpt.HOUR,     selected: false,  enabled: false },
    [DateOpt.DAY]:      { label: 'Day',   selector: DateOpt.DAY,      selected: true,   enabled: true },
    [DateOpt.MONTH]:    { label: 'Month', selector: DateOpt.MONTH,    selected: false,  enabled: true },
    [DateOpt.YEAR]:     { label: 'Year',  selector: DateOpt.YEAR,     selected: false,  enabled: true }
  };

  // Graph Options
  view: any[] = [750, 400];
  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = 'Hpv Variant';
  colorScheme = {domain: ['#5AA454', '#A10A28', '#C7B42C']};
  xScaleMin = this.getXScaleMin();
  xScaleMax = this.getXScaleMax();
  xAxisTicks = [];
  xAxisTickFormater = function( date: Date ) {
    // TOOD
    return date;
    /*
    const year  = date.getFullYear();
    const month = this.showMonth() ? `${date.getMonth()+1}/` : '';
    const day = this.showDay() ? `${date.getDay()+1}/` : '';
    const min = this.showMinSec() ? `${date.getMinutes()}:` : '';
    const sec = this.showMinSec() ? `${date.getSeconds()} ` : '';

    return `${min}${sec}${month}${day}${year}`;
    // return `${date.getMonth()+1}/${date.getDay()+1}/${}`;
    */
  }

  constructor(private hpvDataService: HpvDataService) {
    this.init();
  }
  ngOnInit() {}

  init(): void {
    this.hpvPatientData = this.hpvDataService.getHpvData();
    this.calculateTicks();
  }

  /**
   * Initializes the currently sle
   */
  getSelectedTimeOption(): DateOpt {
    for( var key in this.dataSelectors ){
      const opt = this.dataSelectors[key] || {};
      if( opt[ 'selected' ] ){
        return opt['selector'];
      }
    }
    console.error('NO DATE SELECTOR SELECTED');
    return null;
  }

  // Handles event emitted by select box
  public handleToggle(toggleOpt: DateOpt): void {
    const currOpt = this.getSelectedTimeOption();
    if( toggleOpt === currOpt ){ return; };

    this.changeTimeSelector(toggleOpt, currOpt);
    this.hpvPatientData = this.reformatArray();
    this.calculateTicks();
  }

  /**
   * Toggles global time selector map so that previous opt is toggled off and input timeselector is toggled on.
   */
  public changeTimeSelector(toggleOpt: DateOpt, currOpt: DateOpt): void {
    this.dataSelectors[  currOpt  ][ 'selected' ] = false;
    this.dataSelectors[ toggleOpt ][ 'selected' ] = true ;
  }

  /**
   * Handler for uplaod event, which should be formatted as a datapoint
   */
  public addVcfUpload($event: Object): void {
    if( !this.isValidDataPoint( $event ) ){
      console.error( 'Invalid upload' );
      return;
    }

    const hpvPatientData = this.hpvPatientData.slice(0);
    hpvPatientData.push($event);
    this.hpvPatientData = hpvPatientData;
  }

  /**
   * Methods for determining date fields to show
   */
  private showMonth()   {
    return this.getSelectedTimeOption() !== DateOpt.YEAR; }
  private showDay()     {
    const timeSelect = this.getSelectedTimeOption();
    return timeSelect !== DateOpt.YEAR && timeSelect !== DateOpt.MONTH; }
  private showHour()    {
    const timeSelect = this.getSelectedTimeOption();
    return timeSelect === DateOpt.HOUR || timeSelect === DateOpt.MIN_SEC; }
  private showMinSec()  {
    return this.getSelectedTimeOption() === DateOpt.MIN_SEC; }

  /**
   * Returns the date fields (e.g. YEAR, MONTH, DAY,... ) that should be used for date calculations
   * Public for testing
   */
  public getTimeFields(): DateOpt[] {
    const selectors = Object.values(DateOpt)
    const i = selectors.indexOf(this.getSelectedTimeOption());
    return selectors.slice(i, selectors.length);
  }

  /**
   *  Iterate over all timeFields and calculate relevant fields (e.g. seconds, minutes,... ) in date
   *    @date - Full Date to be used for formatting
   *    @timeFields - Array of date fields that should be calcluated in the formatted date
   *                  E.g. Date's formatted up to DAY should have   timeFields = [ DAY, MONTH, YEAR ]
   *    NOTE - Not private for tests
   */
  formatDate(date: Date, timeFields: DateOpt[]): Date {
    let sec, min, hour, day, month, year;
    [ sec, min, hour, day, month, year ] = [ 0, 0, 0, 1, 0, 0 ];

    // timeFields will be a
    for( var selector of timeFields ){
      switch( selector ) {
        case DateOpt.YEAR: {
          year = date.getFullYear();
          break;
        }
        case DateOpt.MONTH: {
          month = date.getMonth();
          break;
        }
        case DateOpt.DAY: {
          day = date.getDay();
          break;
        }
        case DateOpt.HOUR: {
          hour = date.getHours();
          break;
        }
        case DateOpt.MIN_SEC: {
          min = date.getMinutes();
          sec = date.getSeconds();
          break;
        }
        default: {
          break;
        }
      }
    }
    return new Date(year, month, day, hour, min, sec);
  }

  /**
   *  Reformats hpvPatientData w/ new date values
   */
  private reformatArray(): Object[] {
    const dateFormatter = function( entry: Object ) {
      const series = entry[ 'series' ] || {};
      const date = entry['date'];
      const timeFields = this.getTimeFields();
      const updatedSeries = series.map( (datapoint: Object) => {
        const updatedDate = this.formatDate(date, timeFields);
        datapoint[ 'x' ] = updatedDate;
        return datapoint;
      }, date, timeFields);
      entry[ 'series' ] = updatedSeries;
      return entry;
    }

    const newData = this.hpvPatientData.map(dateFormatter, this)
    return newData;
  }

  /**
   *  Determines if input data point is valid
   */
  private isValidDataPoint(dataPoint: any): boolean {
    // Verify type
    if( dataPoint === null || typeof dataPoint !== 'object' ) {
      return false;
    }

    // Verify fields are present
    if( dataPoint[ 'name' ] === null ){
      return false;
    }
    if( dataPoint[ 'series' ] === null || dataPoint[ 'series' ].length === 0 ) {
      return false;
    }

    // Verify datapoint has a non-empty series
    for( var point of dataPoint[ 'series' ] ){
      var fields: string[] = [ 'name', 'x', 'y', 'r' ];

      for( let f of fields ){
        if( point[ f ] === undefined ){
          return false;
        }
      }
    }

    // Passes all checks
    return true;
  }

  private calculateTicks(): void {
    this.xScaleMin  = this.getXScaleMin();
    this.xScaleMax  = this.getXScaleMax();
    this.xAxisTicks = this.getSortedDates();
  }

  /*********** FIELDS FOR CALCULATING GRAPH PARAMETERS ***********/

  // Calclates floor of the x view in graph. This will be a determined buffer level lower than the earliest date
  getXScaleMin(): Date {
    if( this.hpvPatientData === undefined || this.hpvPatientData.length === 0 ){ return null; }

    const xTicks = this.getSortedDates();
    const buffer = this.getBuffer( xTicks );

    const floorDate =  new Date(xTicks[0].getTime());
    floorDate.setTime( floorDate.getTime() - buffer );

    return floorDate;
  }

  // Calclates ceiling of the x view in graph. This will be a determined buffer level higher than the earliest date
  getXScaleMax(): Date {
    if( this.hpvPatientData === undefined || this.hpvPatientData.length === 0 ){ return null; }

    const xTicks = this.getSortedDates();
    const buffer = this.getBuffer( xTicks );

    const ceilDate = new Date(xTicks[xTicks.length-1].getTime());
    ceilDate.setTime( ceilDate.getTime() + buffer );

    return ceilDate;
  }

  // Determines the buffer around the data points
  private getBuffer(xTicks: Date[]): number {
    const minDate = xTicks[0];
    const maxDate = xTicks[xTicks.length-1];
    const range   = Number(maxDate)-Number(minDate);

    // Case of 1 data point/no difference (e.g. if the user selects "year"). We just need a non-zero
    if( range === 0 ){
      return 1;
    }

    return range/xTicks.length;
  }

  /**
   *  Returns a sorted list of the dates in patient data
   */
  private getSortedDates(): Date[] {
    /**
     * The ticks are based on the x values assigned to the data points in the series.
     * To get the correct date values, we take the 'x' value of one data point as
     * they should all be the same. If the series is for some reason empty, we'll take
     * the date value of the object that determines the x value of each point
     */
    const dateValues = this.hpvPatientData.map( (d) => {
      return d['series'][0]['x'];
    });
    dateValues.sort((a,b)=> a-b)
    const uniqueDates = dateValues
                          .map(function (date) { return date.getTime() })
                          .filter(function (date, i, array) {
                            return array.indexOf(date) === i;
                          })
                          .map(function (time) { return new Date(time); });
    return uniqueDates;
  }
}
