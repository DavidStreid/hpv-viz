import {Component, OnInit} from '@angular/core';
import {HpvDataService} from '../services/hpv-data-service';
import {DateOpt} from './models/graph-options.enums';
import {Toggle} from './models/patient-option.class';
import {VcfMap} from './models/vcfMap.class';
import {TypeTracker} from './models/typeTracker.class';

@Component({
  selector: 'app-type-graph', // tslint:disable-line
  templateUrl: './type-graph.component.html',
  styleUrls: ['./type-graph.component.scss'],
  providers: [HpvDataService]
})
export class TypeGraphComponent implements OnInit {
  public hpvPatientData: Object[];                // IMMUTABLE: Replaced w/ new data clone. Never updated by formatting
  public results: Object[];                       // MUTABLE: Modified/replaced on formatting and appending of data
  public vcfFileMap: Map<string, Object[]>;       // Map of all the VCF files for a given patient - key: patient

  public typeToggles: Map<string, Toggle>;        // types -> Toggle (Toggle tracks the patients w/ that type)
  public patientToggles: Map<string, Toggle>;     // patient -> Toggle (Toggles don't track anything
  public typeTracker: TypeTracker;
  public oddsRatio: Map<Set<string>, Map<string, number>>;

  // Columns of the vcf file we won't show in the modal on click. Make sure these are capital
  public includeInModal: Set<string> = new Set<string>(['ALT', 'CHROM', 'POS', 'QUAL', 'REF']);
  public modalTitle: string;
  public headers: string[];
  public selectedVariant: Object[] = [];
  public datesOptionsEnabled: object = {
    [DateOpt.MIN_SEC]: false,
    [DateOpt.HOUR]: false,
    [DateOpt.DAY]: true,
    [DateOpt.MONTH]: true,
    [DateOpt.YEAR]: true
  };
  // Map that tracks what date selectors to show
  public dateSelectors: object = {
    [DateOpt.MIN_SEC]: {label: 'Min', selector: DateOpt.MIN_SEC, selected: false},
    [DateOpt.HOUR]: {label: 'Hour', selector: DateOpt.HOUR, selected: false},
    [DateOpt.DAY]: {label: 'Day', selector: DateOpt.DAY, selected: true},
    [DateOpt.MONTH]: {label: 'Month', selector: DateOpt.MONTH, selected: false},
    [DateOpt.YEAR]: {label: 'Year', selector: DateOpt.YEAR, selected: false}
  };

  // Should be of type 'any" so that "keyvalue" pipe can be used in the view
  public enabledDateSelectors: any = {};
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
  private vcfMap: VcfMap;
  // Side Selector width
  private sideSelectorWidthNum = 120;
  public sideSelectorWidth = `${this.sideSelectorWidthNum}px`;
  // TypeGraphContainer - Add 5 for a buffer
  public typeGraphContainerWidth = `${this.sideSelectorWidthNum + this.view[0] + 5}px`;

  constructor(private hpvDataService: HpvDataService) {
    this.init();
  }

  ngOnInit() {
  }

  init(): void {
    this.hpvPatientData = [];
    this.results = [];
    this.patientToggles = new Map();
    this.vcfMap = new VcfMap();
    this.vcfFileMap = new Map();
    this.typeToggles = new Map();
    this.initDateSelectors();
    this.typeTracker = new TypeTracker();
    this.oddsRatio = new Map();

    // FOR TESTING PURPOSES
    /*
    this.getHeaders(this.selectedVariant);
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
   * Removes any dateSelectors that haven't been enabled. We do this because when rendering the page,
   * the date selectors that aren't enabled wiil still give a little bit of unwanted white space
   */
  public initDateSelectors(): any {
    this.enabledDateSelectors = Object.assign({}, this.dateSelectors);
    const dateEntries: string[] = Object.keys(this.datesOptionsEnabled);

    for (const key of dateEntries) {
      const enabled = this.datesOptionsEnabled[key] || false;

      if (!enabled) {
        delete this.enabledDateSelectors[key];
      }
    }
  }

  /**
   * Handler for uplaod event, which should be formatted as a datapoint.
   *    - Updates component's hpvPatientData
   *    - Updates component's results (updateViewOnFiltered)
   *
   * @param $event, Object[] - list of enriched objects containing variant info
   */
  public addVcfUpload($event: Object): void {
    const name = $event['name'] || '';
    const date = $event['date'] || null;
    const variantInfo = $event['variantInfo'] || [];
    const metaData = $event['metaData'] || {};

    const dataPoint = this.formatForVisualization(name, date, variantInfo);

    const types: string[] = variantInfo['types'];
    this.calculateOddsRatiosFromTypes(types);

    // Update map of types to the patients that have that type. Adding any new type entries
    const typeToggles: Map<string, Toggle> = new Map(this.typeToggles);
    for (const type of types) {
      let opt: Toggle = new Toggle(type, true);
      if (typeToggles.has(type)) {
        opt = typeToggles.get(type);
      }
      typeToggles.set(type, opt);

      // Opt will keep track of all patients that have that type
      const data = opt.getData();
      data.add(name);
      opt.setData(data);
    }
    this.typeToggles = typeToggles;

    if (!this.isValidDataPoint(dataPoint)) {
      console.error('Invalid upload');
      return;
    }

    // Add to VcfFileMap
    if (this.vcfFileMap.has(name)) {
      // Clone the VcfFileMap so that change detection occurs for child components
      const currentMap = this.vcfFileMap.get(name).slice(0);
      currentMap.push(metaData);
      this.vcfFileMap.set(name, currentMap);
    } else {
      this.vcfFileMap.set(name, [metaData]);
    }

    // Clone and add uploaded datapoint
    const hpvPatientData = this.hpvPatientData.slice(0);
    hpvPatientData.push(dataPoint);
    this.hpvPatientData = hpvPatientData;

    // Since a new vcf upload can change the selected patient, we need to refilter
    this.addPatientToOptions(name);

    const filteredResults: Object[] = this.getFilteredResults(this.hpvPatientData);
    this.updateViewOnFiltered(filteredResults);
  }

  /**
   * Reruns filter - when using an Opt that has an internal state
   */
  public updateFilter(): void {
    const hpvPatientData = this.hpvPatientData.slice(0);
    const filteredResults: Object[] = this.getFilteredResults(hpvPatientData);
    this.updateViewOnFiltered(filteredResults);
  }

  /**
   *  Handles toggling of select box of patients
   */
  public handlePatientToggle(name: string): void {
    if (!this.patientToggles.has(name)) {
      return;
    }

    // Flip all patients to false and then toggle the input patient name
    this.deselectAllPatients();
    this.patientToggles.get(name).toggle();   // Toggle option

    const filteredResults: Object[] = this.getFilteredResults(this.hpvPatientData);
    this.updateViewOnFiltered(filteredResults);
  }

  /**
   * Handles event emitted by select box
   */
  public handleDateToggle(toggleOpt: DateOpt): void {
    const currOpt = this.getSelectedTimeOption();
    if (toggleOpt === currOpt) {
      return;
    }

    this.changeTimeSelector(toggleOpt, currOpt);

    const filteredResults: Object[] = this.getFilteredResults(this.hpvPatientData);
    this.updateViewOnFiltered(filteredResults);
  }

  /**
   * Toggles global time selector map so that previous opt is toggled off and input timeselector is toggled on.
   */
  public changeTimeSelector(toggleOpt: DateOpt, currOpt: DateOpt): void {
    this.enabledDateSelectors[currOpt]['selected'] = false;
    this.enabledDateSelectors[toggleOpt]['selected'] = true;
  }

  /**
   * Returns the selected time option from the global map. Package private for tests
   */
  getSelectedTimeOption(): DateOpt {
    for (const key in this.enabledDateSelectors) {
      if (this.enabledDateSelectors.hasOwnProperty(key)) {
        const opt = this.enabledDateSelectors[key] || {};
        if (opt['selected']) {
          return opt['selector'];
        }
      }
    }
    return null;
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
   * Fires when user clicks on datapoint in the graph
   *
   * @param $event, object - Object containing x,y values of the clicked on datapoint
   *        e.g. [{
   *                name: Thu Jun 2 2019 00:00:00 GMT-0400 (Eastern Daylight Time),
   *                value: "CHROM1",
   *                series: "PATIENT"
   *              }]
   */
  public onClick($event): Object[] {
    const sample: string = $event.series;
    const date: Date = $event.name;
    const chr: string = $event.value;

    const variantInfo: Object[] = this.vcfMap.get(sample, date, chr);
    this.setModalinformation(variantInfo);

    // Return for testing purposes
    return variantInfo;
  }

  /**
   * Closes Modal. Does this by clearing all modal fields, specifically, selectedVariant
   *
   * @param $event, boolean - event passed to initialize close modal
   */
  public closeModal($event: boolean) {
    this.selectedVariant = [];
    this.headers = [];
    this.modalTitle = '';
  }

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
    [sec, min, hour, day, month, year] = [0, 0, 0, 1, 0, 0];

    // timeFields will be a
    for (const selector of timeFields) {
      switch (selector) {
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

  /*********** FIELDS FOR CALCULATING GRAPH PARAMETERS ***********/

  // Calclates floor of the x view in graph. This will be a determined buffer level lower than the earliest date
  getXScaleMin(): Date {
    if (this.results === undefined || this.results.length === 0) {
      return null;
    }

    const xTicks = this.getSortedDates();
    const buffer = this.getBuffer(xTicks);

    const floorDate = new Date(xTicks[0].getTime());
    floorDate.setTime(floorDate.getTime() - buffer);

    return floorDate;
  }

  // Calclates ceiling of the x view in graph. This will be a determined buffer level higher than the earliest date
  getXScaleMax(): Date {
    if (this.results === undefined || this.results.length === 0) {
      return null;
    }

    const xTicks = this.getSortedDates();
    const buffer = this.getBuffer(xTicks);

    const ceilDate = new Date(xTicks[xTicks.length - 1].getTime());
    ceilDate.setTime(ceilDate.getTime() + buffer);

    return ceilDate;
  }

  /**
   * Calculate Odds Ratios from a list of string types
   */
  private calculateOddsRatiosFromTypes(types: string[]): void {
    this.typeTracker.addTypes(types);
    this.oddsRatio = this.typeTracker.calculateOddsRatios();
  }

  private deselectAllPatients(): void {
    this.patientToggles.forEach((patientOpt: Toggle) => {
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

    if (!this.patientToggles.has(name)) {
      // Create a new patient option and toggle to true
      const opt: Toggle = new Toggle(name, true);
      this.patientToggles.set(name, opt);
    } else {
      this.patientToggles.get(name).setSelected(true);
    }
  }

  /**
   * Toggles all patients to be selected
   */
  private toggleTogglesToSelected(): void {
    function toggle(value, key, map) {
      value.toggle(true);
    }

    this.patientToggles.forEach(toggle);
  }

  /**
   * Returns function in closure w/ access to the currently toggled time option.
   */
  private getTickFormatter(): Function {
    const dateOpt: DateOpt = this.getSelectedTimeOption();
    const formatObject: Object[] = this.getFormatOrder(dateOpt);

    return function (date: Date) {
      let tick = '';
      for (const o of formatObject) {
        for (const f of o['funcs']) {
          let val = date[f]();
          if (f === 'getMonth') {
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
   * Creates a formatter object w/ knowledge of delimiter and funcs to use when creating the dateOpt field of a date
   *    formatterObject: {
   *      dateOpt:    specified DateOpt field
   *      delimiter:  how this date field should be seperated from the date field that comes after it
   *      funcs:      function properties of Date (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
   *                  that should be called on an input date object to determine the right values to extract
   *    }
   */
  private createFormatObject(dateOpt: DateOpt, delimiter: string, funcs: string[]) {
    return {dateOpt, delimiter, funcs};
  }

  /**
   * Returns an array of format objects ordered so that preceding elements in the array should be calculated first
   *    e.g. On input DateOpt.DAY -> Use the objects for DAY, MONTH, and YEAR to format the date
   */
  private getFormatOrder(dateOpt: DateOpt): Object[] {
    const formatOrder: Object[] = [
      this.createFormatObject(DateOpt.MIN_SEC, ':', ['getSeconds', 'getMinutes']),
      this.createFormatObject(DateOpt.HOUR, ' ', ['getHours']),
      this.createFormatObject(DateOpt.DAY, '/', ['getDate']),
      this.createFormatObject(DateOpt.MONTH, '/', ['getMonth']),
      this.createFormatObject(DateOpt.YEAR, '', ['getFullYear'])
    ];

    // Return the slice of objects that should be used for formatting the date
    const numObjs = formatOrder.length;
    for (let i = 0; i < numObjs; i++) {
      if (formatOrder[i]['dateOpt'] === dateOpt) {
        return formatOrder.slice(i, numObjs);
      }
    }

    // Chooose the last object - should be the date field that can stand alone (E.g. YEAR)
    return formatOrder.slice(numObjs - 1, numObjs);
  }

  // TODO - Right now extraction isn't the safest. Add constants? Add a dedicated type?
  private extractChromosomeInfo(variantInfo: Object) {
    return variantInfo['CHROM'] || '';
  }

  /**
   * Formats incoming vcf file into a datpoint for the visualization.
   * Datapoint notes:
   *    Radius, r - Data point size. We treat each line as one point (r=1). This can be aggregated by
   *                  - Multiple variants of a chromosome in a file
   *                  - Aggregation of vcfs, e.g. combining all vcfs from a year
   *    Date, x   - Date will be the x axis to show variant change over time
   *
   * @param name, string - Name of the subject the vcf is of
   * @param date, Date - Date the vcf was taken
   * @param variantInfo, Object[] - List of enriched objects representing variant information
   *
   * @return, Object[] - List of objects, where each object contains the data for a specific variant type, indicated by
   *                     name
   *
   *                     e.g. {
   *                         name: 'S1',
   *                         date: '',
   *                         series: [
   *                          {
   *
   *                          },
   *                          ...
   *                         ]
   *                     }
   */
  private formatForVisualization(name: string, date: Date, variantInfo: Object[]) {
    const series = [];

    for (const vi of variantInfo) {
      const dp = {
        name: date,
        y: this.extractChromosomeInfo(vi),
        x: date,
        r: 1,
        data: vi
      };
      series.push(dp);
    }

    return {name, series, date};
  }

  /**
   * Sets modal information based on the variantInfo array passed to the method
   *
   * @param variantInfo, Object[] - Array of variant objects
   */
  private setModalinformation(variantInfo: Object[]): void {
    // Sort variantInfo on the position
    const sortedOnPos: Object[] = variantInfo.sort(function (o1, o2) {
      const pos1Str = o1['POS'] || 0;
      const pos2Str = o2['POS'] || 0;


      const pos1: number = parseInt(pos1Str, 10);
      const pos2: number = parseInt(pos1Str, 10);

      if (isNaN(pos1) || isNaN(pos2)) {
        return 0;
      }

      return pos1 - pos2;
    });

    this.selectedVariant = sortedOnPos;
    this.headers = this.getHeaders(this.selectedVariant);
    this.modalTitle = this.getModalTitle(this.selectedVariant);
  }

  /**
   * Returns modal title given the input data
   *
   * @param data, Object[] - VariantInfo data taken from the vcfMap for that chromosome/time
   */
  private getModalTitle(data: Object[]): string {
    if (data.length === 0) {
      return;
    }

    // Take a look at the first entry to determine the chromosome
    const entry: Object = data[0];
    const chr: string = entry['CHROM'] || 'Chromosome';

    return `Variants for ${chr}, ${data.length} variants`;
  }

  /**
   * Returns headers to display in the modal given the input data
   *
   * @param data, Object[] - VariantInfo data taken from the vcfMap for that chromosome/time
   */
  private getHeaders(data: Object[]): string[] {
    if (data.length === 0) {
      return;
    }

    // Take a look at the first entry to determine all the header values
    const entry: Object = data[0];
    const keys: string[] = Object.keys(entry);

    function includeHeader(includedHeaders) {
      return function (element) {
        return includedHeaders.has(element.toUpperCase());
      };
    }

    // Only take the headers we would like to show
    return keys.filter(includeHeader(this.includeInModal));
  }

  /**
   * Methods for determining date fields to show
   */
  private showMonth() {
    return this.getSelectedTimeOption() !== DateOpt.YEAR;
  }

  private showDay() {
    const timeSelect = this.getSelectedTimeOption();
    return timeSelect !== DateOpt.YEAR && timeSelect !== DateOpt.MONTH;
  }

  private showHour() {
    const timeSelect = this.getSelectedTimeOption();
    return timeSelect === DateOpt.HOUR || timeSelect === DateOpt.MIN_SEC;
  }

  private showMinSec() {
    return this.getSelectedTimeOption() === DateOpt.MIN_SEC;
  }

  /**
   * Performs all filters on the input data
   *
   * @param variants
   */
  private getFilteredResults(variants: Object[]): Object[] {
    const filteredPatients: Object[] = this.filterOnSelectedPatients(variants);
    const filteredTypes: Object[] = this.filterOnSelectedTypes(filteredPatients);
    return filteredTypes;
  }

  /**
   * Removes all patients that aren't selected by the filters. This filtering does not require transforming
   * the dataset, however, if filters are already being applied on fields that require transformation (e.g. date,
   * chromsome type, mutation tepe), then transformations will need to happen after this method.
   */
  private filterOnSelectedPatients(source: Object[]): Object[] {
    const patientFilter = function (entry: Object) {
      const name: string = entry['name'] || '';
      return this.patientToggles.get(name).isSelected();
    };

    const newData = source.filter(patientFilter, this);
    return newData;
  }

  /**
   * Removes types from source that have been toggled by the user
   *
   * @param source, Object[] - Source of variantInfo data
   */
  private filterOnSelectedTypes(source: Object[]): Object[] {
    // Pre-process list
    const itr: IterableIterator<Toggle> = this.typeToggles.values();
    const types: Set<String> = new Set();
    let opt: IteratorResult<Toggle> = itr.next();
    while (!opt.done) {
      if (opt.value.isSelected()) {
        types.add(opt.value.getName());
      }
      opt = itr.next();
    }

    const filtered: Object[] = [];

    for (const vcfData of source) {
      const clone: Object = Object.assign({}, vcfData);
      // Only return points that are in the typeToggles map
      clone['series'] = vcfData['series'].filter(type => {
        return types.has(type['y']);
      }, this);
      filtered.push(clone);
    }

    return filtered;
  }

  /**
   * Called to update the view based on input data. All view state fields should be updated -
   *    View State:
   *      - results: dataPoints, which can be modified by the patient-filter or aggregated by date
   *      - x-axis Ticks: xScaleMin, xScaleMax, xAxisTicks - Change based on potentially new x-values
   *      - xAxisTickFormater: Formatter of x-axis (dates), which is based on the date filters selected
   *    @source - Set of datapoints that will determine the x-axis & values
   */
  private updateViewOnFiltered(source: Object[]): void {
    // Clear the vcfMap so that the vcfMap can be populated by the input source
    this.vcfMap.clear();

    const xValues = this.calculateXValues(source);   // Recalculate X-Axis values for each datapoint
    const aggregatedSeries: Object[] = this.aggregateSeriesOnXValues(xValues);

    this.results = aggregatedSeries;

    this.calculateXTicks();                         // Recalculate X-Axis ticks to show (E.g. min/max)
    this.reAssignXTickFormatter();                  // Recalculate X-Axis tick-formatter for displaying values on x-axis
  }

  /**
   *  Reformats x positions of source data to reflect changes to the date selector.
   *    Modified field - Obj[ 'series' ][ i ][ 'x' ]
   *
   *    NOTE -  Each datapoint will have an x & name value. x determines its position on the x-axis. However,
   *            during the onClick event, the 'name' NOT the 'x' is passed. So we want these two fields to match
   *
   *  {
   *    "name":"ZH8972",
   *    "date":"2017-06-29T17:05:23.000Z
   *    "series":[                                      <- Array of datapoints
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
    const dateFormatter = function (entry: Object) {
      const series = entry['series'] || {};
      const date = entry['date'];
      const timeFields = this.getTimeFields();
      const updatedSeries = series.map((datapoint: Object) => {
        const updatedDate = this.formatDate(date, timeFields);
        datapoint['x'] = updatedDate;
        datapoint['name'] = updatedDate;
        return datapoint;
      }, date, timeFields);
      entry['series'] = updatedSeries;
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
    source.sort((p1, p2) => {
      return p1['date'] - p2['date'];
    });
    const dateMap: Object = {};

    for (const dp of source) {
      const series = dp['series'] || [];
      if (series.length === 0) {
        continue;
      }
      const formattedDate: Date = series[0]['x'];
      const key: number = formattedDate.getTime();

      if (key in dateMap) {
        dateMap[key].push(dp);
      } else {
        dateMap[key] = [dp];
      }
    }

    const newResults: Object[] = [];
    for (const date in dateMap) {
      if (dateMap.hasOwnProperty(date)) {
        const entry = this.combineEntries(parseInt(date, 10), dateMap[date]);
        newResults.push(entry);
      }
    }

    return newResults;
  }

  /**
   * Combines the HPV entries for multiple data points into one. Since this can affect the names and combine
   * values, we need to clear and re-compute the vcfMap
   *
   *    [ { hpv1: 1, hpv2: 1}, { hpv1: 1, hpv3: 1 }, ... ] => { hpv1: 2, hpv2: 1, hpv3: 1 }
   */
  private combineEntries(dateVal: number, entries: Object[]): Object {
    const names: Set<string> = new Set();

    // Aggregate all hpv types recorded
    for (const e of entries) {
      const n = e['name'];
      names.add(n);

      const dataPoints: Object[] = e['series'] || [];
      for (const dp of dataPoints) {
        this.vcfMap.add(n, dp);
      }
    }


    const name = Array.from(names.values()).join('-');
    const date = new Date(dateVal);
    const series = this.createSeriesFromMap(this.vcfMap, date);

    return {name, series, date};
  }

  private createSeriesFromMap(vcfMap: VcfMap, date: Date): Object[] {
    const series = [];
    for (const chr of vcfMap.keys()) {
      const dp = {
        name: date,
        y: chr,
        x: date,
        r: vcfMap.numEntries(chr)
      };
      series.push(dp);
    }

    return series;
  }

  /**
   *  Determines if input data point is valid
   */
  private isValidDataPoint(dataPoint: any): boolean {
    // Verify type
    if (dataPoint === null || typeof dataPoint !== 'object') {
      return false;
    }

    // Verify fields are present
    if (dataPoint['name'] === null) {
      return false;
    }
    if (dataPoint['series'] === null || dataPoint['series'].length === 0) {
      return false;
    }

    // Verify datapoint has a non-empty series
    for (const point of dataPoint['series']) {
      const fields: string[] = ['name', 'x', 'y', 'r'];

      for (const f of fields) {
        if (point[f] === undefined) {
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
    this.xScaleMin = this.getXScaleMin();
    this.xScaleMax = this.getXScaleMax();
    this.xAxisTicks = this.getSortedDates();
  }

  // Determines the buffer around the data points
  private getBuffer(xTicks: Date[]): number {
    const minDate = xTicks[0];
    const maxDate = xTicks[xTicks.length - 1];
    const range = Number(maxDate) - Number(minDate);

    // Case of 1 data point/no difference (e.g. if the user selects "year"). We just need a non-zero
    if (range === 0) {
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
    const dateValues = this.results.map((d) => {
      return d['series'][0]['x'];
    });
    dateValues.sort((a, b) => a - b);
    const uniqueDates = dateValues
      .map(function (date) {
        return date.getTime();
      })
      .filter(function (date, i, array) {
        return array.indexOf(date) === i;
      })
      .map(function (time) {
        return new Date(time);
      });
    return uniqueDates;
  }
}
