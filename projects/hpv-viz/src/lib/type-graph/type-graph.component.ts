import { Component, OnInit }  from '@angular/core';
import { HpvDataService }     from '../services/hpv-data-service';
import { DateOpt }            from './graph-options.enums';
import { PatientOption }      from './patient-option.class';

@Component({
  selector:      'app-type-graph', // tslint:disable-line
  templateUrl:  './type-graph.component.html',
  styleUrls:    ['./type-graph.component.scss'],
  providers:    [ HpvDataService ]
})
export class TypeGraphComponent implements OnInit {
  public hpvPatientData: Object[];                // IMMUTABLE - Cloned version w/ new data replaces it. Never updated by formatting
  public results: Object[];                       // MUTABLE - Modified or replaced on formatting changes and appending of data
  public patientMap: Map<string, PatientOption>;  // Map of patient names to their options

  public datesOptionsEnabled: object = {
    [DateOpt.MIN_SEC]:  false,
    [DateOpt.HOUR]:     false,
    [DateOpt.DAY]:      true,
    [DateOpt.MONTH]:    true,
    [DateOpt.YEAR]:     true
  }

  // Map that tracks what date selectors to show
  public dateSelectors: object = {
    [DateOpt.MIN_SEC]:  { label: 'Min',   selector: DateOpt.MIN_SEC,  selected: false },
    [DateOpt.HOUR]:     { label: 'Hour',  selector: DateOpt.HOUR,     selected: false },
    [DateOpt.DAY]:      { label: 'Day',   selector: DateOpt.DAY,      selected: true },
    [DateOpt.MONTH]:    { label: 'Month', selector: DateOpt.MONTH,    selected: false },
    [DateOpt.YEAR]:     { label: 'Year',  selector: DateOpt.YEAR,     selected: false }
  };

  // Shoudl be of type "any" so that "keyvalue" pipe can be used in the view
  public enabledDateSelectors: any = {};

  // Side Selector width
  private sideSelectorWidthNum: number = 120;
  public sideSelectorWidth: string = `${this.sideSelectorWidthNum}px`;

  // Graph Options
  public view: any[] = [750, 400];
  public width = `${this.view[0]}px`;
  public height = `${this.view[1]}px`;
  public showXAxis = true;
  public showYAxis = true;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel = 'Date';
  public showYAxisLabel = true;
  public yAxisLabel = 'Hpv Variant';
  public colorScheme = {domain: ['#8585ad', '#7575a3', '#666699']};
  public xScaleMin = this.getXScaleMin();
  public xScaleMax = this.getXScaleMax();
  public xAxisTicks = [];
  public xAxisTickFormater = this.getTickFormatter();

  // TypeGraphContainer
  public typeGraphContainerWidth: string = `${this.sideSelectorWidthNum + this.view[0]}px`;

  constructor(private hpvDataService: HpvDataService) {
    this.init();
  }
  ngOnInit() {}

  /**
   * Removes any dateSelectors that haven't been enabled. We do this because when rendering the page,
   * the date selectors that aren't enabled wiil still give a little bit of unwanted white space
   */
  public initDateSelectors(): any {
    this.enabledDateSelectors = Object.assign({}, this.dateSelectors);
    const dateEntries: string[] =  Object.keys(this.datesOptionsEnabled);

    for( const key of dateEntries ){
      const enabled = this.datesOptionsEnabled[key] || false;

      if( ! enabled ){
        delete this.enabledDateSelectors[key];
      }
    }
  }

  init(): void {
    this.hpvPatientData = [];
    this.results = [];
    this.patientMap = new Map();
    this.initDateSelectors();

    /*
    // FOR TESTING PURPOSES
    const evtTemplate: Object = {
      name: 'P1',
      date: new Date( 'Sun Feb 13 2011 10:38:12 GMT-0500 (Eastern Standard Time)' ),
      hpvTypes: new Set(['C1', 'C2', 'C3', 'C4', 'C5']),
    };
    for( var i = 0; i<4; i++ ) {
      const evt = Object.assign({}, evtTemplate);
      evt[ 'name' ] = `P${i+1}`;
      this.addVcfUpload( evt );
    }
    */
  }

  /**
   * Handler for uplaod event, which should be formatted as a datapoint
   */
  public addVcfUpload($event: Object): void {
    const name = $event[ 'name' ] || '';
    const date = $event[ 'date' ] || null;
    const hpvTypes = $event[ 'hpvTypes' ] || new Set();

    const dataPoint = this.formatForVisualization( name, date, hpvTypes );

    if ( !this.isValidDataPoint( dataPoint) ) {
      console.error( 'Invalid upload' );
      return;
    }

    // Clone and add uploaded datapoint
    const hpvPatientData = this.hpvPatientData.slice(0);
    hpvPatientData.push(dataPoint);
    this.hpvPatientData = hpvPatientData;

    // Since a new vcf upload can change the selected patient, we need to refilter
    this.addPatientToOptions( name );

    this.results = this.filterOnSelectedPatients(this.hpvPatientData);
    this.updateXAxisAndValues(this.results);
  }

  /**
   *  Handles toggling of select box of patients
   */
  public handlePatientToggle(name: string): void {
    if ( !this.patientMap.has(name) ) { return; }

    // Flip all patients to false and then toggle the input patient name
    this.deselectAllPatients();
    this.patientMap.get(name).toggle();   // Toggle option

    const filteredResults: Object[] = this.filterOnSelectedPatients(this.hpvPatientData);
    this.updateXAxisAndValues(filteredResults);
  }

  private deselectAllPatients(): void {
    this.patientMap.forEach((patientOpt: PatientOption) => {
      patientOpt.setSelected(false);
    });
  }

  /**
   * Adds option for patient if it doesn't already exist
   *    *Toggles selected field of patient Map so that only uploaded one is selected
   */
  private addPatientToOptions(name: string): void {
    // Toggle all other patients to false. Should only be one, but for readability, do for all
    this.deselectAllPatients();

    if ( !this.patientMap.has(name) ) {
      // Create a new patient option and toggle to true
      const opt: PatientOption = new PatientOption( name, true );
      this.patientMap.set(name, opt);
    } else {
      this.patientMap.get(name).setSelected(true);
    }
  }

  /**
   * Handles event emitted by select box
   */
  public handleDateToggle(toggleOpt: DateOpt): void {
    const currOpt = this.getSelectedTimeOption();
    if ( toggleOpt === currOpt ) { return; }

    this.changeTimeSelector(toggleOpt, currOpt);

    this.results = this.filterOnSelectedPatients(this.hpvPatientData);
    this.updateXAxisAndValues(this.results);
  }

  /**
   * Toggles global time selector map so that previous opt is toggled off and input timeselector is toggled on.
   */
  public changeTimeSelector(toggleOpt: DateOpt, currOpt: DateOpt): void {
    this.enabledDateSelectors[  currOpt  ][ 'selected' ] = false;
    this.enabledDateSelectors[ toggleOpt ][ 'selected' ] = true ;
  }

  /**
   * Toggles all patients to be selected
   */
  private togglePatientOptionsToSelected(): void {
    function toggle(value, key, map) {
      value.toggle(true);
    }
    this.patientMap.forEach(toggle);
  }

  /**
   * Called to update the x-axis & data-point along the x-axis
   * TODO - comment on side-effects
   */
  private updateXAxisAndValues(source: Object[]): void {
    const xValues = this.calculateXValues(source);   // Recalculate X-Axis values for each datapoint
    const aggregatedSeries: Object[] = this.aggregateSeriesOnXValues(xValues);

    this.results = aggregatedSeries;

    this.calculateXTicks();                         // Recalculate X-Axis ticks to show (E.g. min/max)
    this.reAssignXTickFormatter();                  // Recalculate X-Axis tick-formatter for displaying values on x-axis
  }

  /**
   * Returns the selected time option from the global map. Package private for tests
   */
  getSelectedTimeOption(): DateOpt {
    for ( const key in this.enabledDateSelectors ) {
      if (this.enabledDateSelectors.hasOwnProperty(key)) {
        const opt = this.enabledDateSelectors[key] || {};
        if ( opt[ 'selected' ] ) {
          return opt['selector'];
        }
      }
    }
    return null;
  }

  /**
   * Returns function in closure w/ access to the currently toggled time option.
   */
  private getTickFormatter(): Function {
    const dateOpt: DateOpt = this.getSelectedTimeOption();
    const formatObject: Object[] = this.getFormatOrder(dateOpt);

    return function (date: Date) {
      let tick = '';
      for ( const o of formatObject ) {
        for ( const f of o[ 'funcs' ] ) {
          var val = date[f]();
          if( f === 'getMonth' ) {
            // Months are 0-indexed
            val += 1;
          }
          tick = `${tick}${val}${o['delimiter']}`;
        }
      }
      return tick;
    };
  }

  /**
   * Re-assigns the xAxistTickFormatter. This must be done b/c ngx-charts evaluates all data-bound inputs only on
   * initialization
   *    - NOTE: This function requires a helper function to call it
   *    - Public for tests
   */
  public reAssignXTickFormatter(): void {
    this.xAxisTickFormater = this.getTickFormatter();
  }

  /**
   * Creates a formatter object w/ knowledge of delimiter and funcs to use when creating the dateOpt field of a date
   *    formatterObject: {
   *      dateOpt:    specified DateOpt field
   *      delimiter:  how this date field should be seperated from the date field that comes after it
   *      funcs:      function properties of Date (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
   *                  that should be called on an input date object to determine the right values to extract
   *    }
   */
  private createFormatObject(dateOpt: DateOpt, delimiter: string, funcs: string[]) {
    return { dateOpt, delimiter, funcs };
  }

  /**
   * Returns an array of format objects ordered so that preceding elements in the array should be calculated first
   *    e.g. On input DateOpt.DAY -> Use the objects for DAY, MONTH, and YEAR to format the date
   */
  private getFormatOrder(dateOpt: DateOpt): Object[] {
    const formatOrder: Object[] = [
      this.createFormatObject( DateOpt.MIN_SEC, ':', ['getSeconds', 'getMinutes']),
      this.createFormatObject( DateOpt.HOUR, ' ', ['getHours']),
      this.createFormatObject( DateOpt.DAY, '/', ['getDate']),
      this.createFormatObject( DateOpt.MONTH, '/', ['getMonth']),
      this.createFormatObject( DateOpt.YEAR, '', ['getFullYear'])
    ];

    // Return the slice of objects that should be used for formatting the date
    const numObjs = formatOrder.length;
    for ( let i = 0; i < numObjs; i++ ) {
      if ( formatOrder[i]['dateOpt'] === dateOpt ) {
        return formatOrder.slice(i, numObjs);
      }
    }

    // Chooose the last object - should be the date field that can stand alone (E.g. YEAR)
    return formatOrder.slice(numObjs - 1, numObjs);
  }

  private formatForVisualization(name: string, date: Date, hpvTypes: Set<string>) {
    const series = [];

    hpvTypes.forEach( function(type) {
      const o1 = {
        name: date,
        y: type,
        x: date,
        r: 1
      };
      series.push(o1);
    });

    return { name, series, date };
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
    const selectors = Object.keys(DateOpt).map(key => DateOpt[key]);
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
    for ( const selector of timeFields ) {
      switch ( selector ) {
        case DateOpt.YEAR: {
          year = date.getFullYear();
          break;
        }
        case DateOpt.MONTH: {
          month = date.getMonth();
          break;
        }
        case DateOpt.DAY: {
          day = date.getDate();
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
   * Removes all patients that aren't selected by the filters
   */
  private filterOnSelectedPatients(source: Object[]): Object[] {
    const patientFilter = function( entry: Object ) {
      const name: string = entry[ 'name' ] || '';
      return this.patientMap.get(name).isSelected();
    };

    const newData = source.filter( patientFilter, this );
    return newData;
  }

  /**
   *  Reformats x positions of source data to reflect changes to the date selector.
   *    Modified field - Obj[ 'series' ][ i ][ 'x' ]
   *
   *  {
   *    "name":"ZH8972",
   *    "date":"2017-06-29T17:05:23.000Z
   *    "series":[
   *      {
   *        "name":"2017-06-29T17:05:23.000Z",
   *        "y":"HPV39_Ref",
   *        "x":"2017-06-04T04:00:00.000Z",
   *        "r":1},
   *      ...] }
   *
   *  {
   *    "name":"ZH8972",
   *    "date":"2017-06-29T17:05:23.000Z"
   *    "series":[
   *      {
   *        "name":"2017-06-29T17:05:23.000Z",
   *        "y":"HPV39_Ref",
   *        "x":"2017-06-04T04:00:00.000Z",       <- DIFFERENT
   *        "r":1
   *      },...], }
   */
  private calculateXValues(source: Object[]): Object[] {
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
    };

    const newData = source.map(dateFormatter, this);
    return newData;
  }

  /**
   * Combines datapoints that belong to the same x-value (Obj['series']['x']) in the results
   *  - Should go after all formatting options
   *  - Should go after new data being uploaded
   */
  private aggregateSeriesOnXValues(source: Object[]): Object[] {
    source.sort( (p1, p2) => {
      return p1['date'] - p2['date'];
    });
    const dateMap: Object = {};

    for ( const dp of source ) {
      const series = dp['series'] || [];
      if ( series.length === 0 ) { continue; }
      const formattedDate: Date = series[0]['x'];
      const key: number = formattedDate.getTime();

      if ( key in dateMap ) {
        dateMap[ key ].push( dp );
      } else {
        dateMap[ key ] = [ dp ];
      }
    }

    const newResults: Object[] = [];
    for ( const date in dateMap ) {
      if (dateMap.hasOwnProperty(date)) {
        newResults.push( this.combineEntries( parseInt(date, 10), dateMap[ date ] ) );
      }
    }

    return newResults;
  }

  /**
   * Combines the HPV entries for multiple data points into one
   *    [ { hpv1: 1, hpv2: 1}, { hpv1: 1, hpv3: 1 }, ... ] => { hpv1: 2, hpv2: 1, hpv3: 1 }
   */
  private combineEntries( dateVal: number, entries: Object[] ): Object {
    const names: string[] = [];
    const hpvMap = {};

    // Aggregate all hpv types recorded
    for ( const e of entries ) {
      const n = e[ 'name' ];
      names.push( n );

      const dataPoints: Object[] = e[ 'series' ] || [];
      for ( const dp of dataPoints ) {
        const hpv = dp[ 'y' ];
        if ( hpv in hpvMap ) {
          hpvMap[ hpv ] += 1;
        } else {
          hpvMap[ hpv ] = 1;
        }
      }
    }

    const name    = names.join('-');
    const date    = new Date(dateVal);
    const series  = this.createSeriesFromMap(hpvMap, date);

    return { name, series, date };
  }

  private createSeriesFromMap(hpvMap: Object, date: Date): Object[] {
    const series = [];
    for ( const k in hpvMap ) {
      if ( hpvMap.hasOwnProperty(k) ) {
        const dp = {
          name: k,
          y: k,
          x: date,
          r: hpvMap[k]
        };
        series.push(dp);
      }
    }
    return series;
  }

  /**
   *  Determines if input data point is valid
   */
  private isValidDataPoint(dataPoint: any): boolean {
    // Verify type
    if ( dataPoint === null || typeof dataPoint !== 'object' ) {
      return false;
    }

    // Verify fields are present
    if ( dataPoint[ 'name' ] === null ) {
      return false;
    }
    if ( dataPoint[ 'series' ] === null || dataPoint[ 'series' ].length === 0 ) {
      return false;
    }

    // Verify datapoint has a non-empty series
    for ( const point of dataPoint[ 'series' ] ) {
      const fields: string[] = [ 'name', 'x', 'y', 'r' ];

      for ( const f of fields ) {
        if ( point[ f ] === undefined ) {
          return false;
        }
      }
    }

    // Passes all checks
    return true;
  }

  /**
   * Calculates x-axis ticks
   */
  private calculateXTicks(): void {
    this.xScaleMin  = this.getXScaleMin();
    this.xScaleMax  = this.getXScaleMax();
    this.xAxisTicks = this.getSortedDates();
  }

  /*********** FIELDS FOR CALCULATING GRAPH PARAMETERS ***********/

  // Calclates floor of the x view in graph. This will be a determined buffer level lower than the earliest date
  getXScaleMin(): Date {
    if ( this.results === undefined || this.results.length === 0 ) { return null; }

    const xTicks = this.getSortedDates();
    const buffer = this.getBuffer( xTicks );

    const floorDate =  new Date(xTicks[0].getTime());
    floorDate.setTime( floorDate.getTime() - buffer );

    return floorDate;
  }

  // Calclates ceiling of the x view in graph. This will be a determined buffer level higher than the earliest date
  getXScaleMax(): Date {
    if ( this.results === undefined || this.results.length === 0 ) { return null; }

    const xTicks = this.getSortedDates();
    const buffer = this.getBuffer( xTicks );

    const ceilDate = new Date(xTicks[xTicks.length - 1].getTime());
    ceilDate.setTime( ceilDate.getTime() + buffer );

    return ceilDate;
  }

  // Determines the buffer around the data points
  private getBuffer(xTicks: Date[]): number {
    const minDate = xTicks[0];
    const maxDate = xTicks[xTicks.length - 1];
    const range   = Number(maxDate) - Number(minDate);

    // Case of 1 data point/no difference (e.g. if the user selects "year"). We just need a non-zero
    if ( range === 0 ) {
      return 1;
    }

    return range / xTicks.length;
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
    const dateValues = this.results.map( (d) => {
      return d['series'][0]['x'];
    });
    dateValues.sort((a, b) => a - b);
    const uniqueDates = dateValues
                          .map(function (date) { return date.getTime(); })
                          .filter(function (date, i, array) {
                            return array.indexOf(date) === i;
                          })
                          .map(function (time) { return new Date(time); });
    return uniqueDates;
  }
}
