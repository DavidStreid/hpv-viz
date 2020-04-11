import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DateOpt} from './models/graph-options.enums';
import {TypeGraphComponent} from './type-graph.component';
import {TableModalComponent} from '../common/modal/table-modal.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {INIT_DATA_POINTS, INIT_DATA_POINTS_EVENTS, YEAR_TRANSFORM_DATES} from '../../test/mock-data/mock-viz';
import {TEST_FILES} from '../../test/mock-data/vcf-files';
import {Toggle} from './models/toggle.class';
import {By} from '@angular/platform-browser';

describe('TypeGraphComponent', () => {
  let component: TypeGraphComponent;
  let fixture: ComponentFixture<TypeGraphComponent>;

  /**
   * This method is a sanity check on what we expect the results to be. It should be used WHENEVER componetn.vcfupload
   * is called
   *
   * @param results, Object[] - the "results" field of the component
   */
  function verifyResults(results: Object[]) {
    expect(results.length > 0).toBeTruthy();
    for (const r of results) {
      expect(r['name'] === r['x']);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TypeGraphComponent, TableModalComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeGraphComponent);
    component = fixture.componentInstance;

    // For these tests, we'll enable all dateOptions
    for (const key in component.datesOptionsEnabled) {
      if (component.datesOptionsEnabled.hasOwnProperty(key)) {
        component.datesOptionsEnabled[key] = true;
      }
    }
    component.initDateSelectors();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('When select box is toggled, the formatted date should return a date based on the time selection', () => {
    // Verify that 'Sat Apr 06 2019 14:00:04 GMT-0400' is formatted correctly
    const year = 2019;
    const month = 3;    // April
    const day = 6;
    const hour = 13;
    const min = 0;
    const sec = 4;

    const testDate = new Date(year, month, day, hour, min, sec);
    const testCases = [
      [DateOpt.MIN_SEC, new Date(year, month, day, hour, min, sec)],
      [DateOpt.HOUR, new Date(year, month, day, hour, 0, 0)],
      [DateOpt.DAY, new Date(year, month, day, 0, 0, 0)],
      [DateOpt.MONTH, new Date(year, month, 1, 0, 0)],
      [DateOpt.YEAR, new Date(year, 0, 1, 0, 0)]
    ];
    
    for (const test of testCases) {
      const timeSelect = test[0];
      const expectedDate = <Date>test[1];

      component.handleDateToggle(<DateOpt>timeSelect);
      const timeFields: DateOpt[] = component.getTimeFields();
      const actualDate = <Date>component.formatDate(testDate, timeFields);

      expect(actualDate.getTime()).toBe(expectedDate.getTime());
    }
  });

  it('SelectedTimeOption should be DAY upon initialization', () => {
    expect(component.getSelectedTimeOption()).toBe(DateOpt.DAY);
  });

  it('Date selection fields (dataSelectors/timeSelect) change on toggle (handleDateToggle)', () => {
    // Mock data w/ patient map
    // TODO - Put this into a private method
    for (const fileName in TEST_FILES) {
      if (TEST_FILES.hasOwnProperty(fileName)) {
        const event = TEST_FILES[fileName]['event'];
        component.addVcfUpload(event);
      }
    }

    // NOTE - TimeSelect should be initialized to DAY
    let oldToggle: DateOpt = DateOpt.DAY;
    let newToggle: DateOpt = DateOpt.YEAR;

    // Shouldn't do anything
    expect(component.dateSelectors[oldToggle]['selected']).toBeTruthy();
    expect(component.dateSelectors[newToggle]['selected']).toBeFalsy();
    component.handleDateToggle(DateOpt.DAY);
    expect(component.getSelectedTimeOption()).toBe(oldToggle);
    expect(component.dateSelectors[oldToggle]['selected']).toBeTruthy();
    expect(component.dateSelectors[newToggle]['selected']).toBeFalsy();

    const values: DateOpt[] = Object.values(DateOpt);
    for (const v of values) {
      newToggle = v;
      expect(component.dateSelectors[oldToggle]['selected']).toBeTruthy();
      expect(component.dateSelectors[newToggle]['selected']).toBeFalsy();

      component.handleDateToggle(newToggle);

      expect(component.getSelectedTimeOption()).toBe(newToggle);
      expect(component.dateSelectors[oldToggle]['selected']).toBeFalsy();
      expect(component.dateSelectors[newToggle]['selected']).toBeTruthy();
      oldToggle = newToggle;
    }
  });

  it('Toggling the date option should transforms hpvPatientData', () => {
    // TODO - Put this into a private method
    for (const fileName in TEST_FILES) {
      if (TEST_FILES.hasOwnProperty(fileName)) {
        const event = TEST_FILES[fileName]['event'];
        component.addVcfUpload(event);
      }
    }

    // NOTE - TimeSelect should be initialized to DAY
    component.handleDateToggle(DateOpt.YEAR);

    // Makes sure all data-points get tested
    let numDataPoints = component.results.length;

    // Check that there are data points
    expect(numDataPoints > 0).toBeTruthy();
    for (const entry of component.results) {
      numDataPoints -= 1;

      const name = entry['name'];
      const series = entry['series'];
      const date = YEAR_TRANSFORM_DATES[name];

      for (const dp of series) {
        expect(dp['x'].getTime()).toBe(date.getTime());
      }
    }

    expect(numDataPoints).toBe(0);
  });

  // TODO - Maybe make this more finer-grained once a design is approved
  it('x-axis variables are changed with a min and max value outside the range of xAxisTicks', () => {
    let xScaleMin, xScaleMax, xAxisTicks;
    // TODO - Put this into a private method
    for (const fileName in TEST_FILES) {
      if (TEST_FILES.hasOwnProperty(fileName)) {
        const event = TEST_FILES[fileName]['event'];
        component.addVcfUpload(event);
      }
    }

    const values: DateOpt[] = Object.values(DateOpt);
    for (const v of values) {
      component.handleDateToggle(v);
      xScaleMin = component.xScaleMin;
      xScaleMax = component.xScaleMax;
      xAxisTicks = component.xAxisTicks;

      expect(xScaleMin).not.toBeNull();
      expect(xScaleMax).not.toBeNull();
      expect(xAxisTicks.length).not.toBe(0);

      const xView = xAxisTicks;
      xView.push(xScaleMax);
      xView.unshift(xScaleMin);

      // Check that there's a min, max, and values in view
      expect(xView.length > 2);

      // Verify ascending order (implicitly checks there's a buffer on each side of the datapoints
      for (let i = 0; i < xView.length - 1; i++) {
        expect(xView[i] < xView[i + 1]).toBeTruthy();
      }
    }
  });

  it('When addVcfUpload handler receives an event, it correctly parses it into a datapoint', () => {
    for (const fileName in TEST_FILES) {
      if (TEST_FILES.hasOwnProperty(fileName)) {
        const event = TEST_FILES[fileName]['event'];
        component.addVcfUpload(event);

        const patientData = component.hpvPatientData;

        const expected = TEST_FILES[fileName]['datapoint'];
        const actual = patientData[patientData.length - 1];

        expect(actual['name']).toBe(expected['name']);
        expect(actual['date'].toDateString()).toBe(expected['date'].toDateString());
        // NOTE - To test the series, comparing by date string isn't going to give the expected equality
        expect(actual['series']).not.toBeNull();
      }
    }
  });

  it('When addVcfUpload handler receives an event, it should populate the patient options map and render a patient '
    + 'option and render an option in the view', () => {
    // Verify initial state
    expect(fixture.debugElement.query(By.css('.patient-opt'))).toBeNull();
    expect(component.patientToggles.size).toBe(0);

    for (const fileName in TEST_FILES) {
      if (TEST_FILES.hasOwnProperty(fileName)) {
        const event = TEST_FILES[fileName]['event'];
        const name = event['name'];

        component.addVcfUpload(event);

        // Patient Map is updated w/ a patient option
        const patientOpt: Toggle = component.patientToggles.get(name);
        expect(patientOpt.getName()).toBe(name);
        expect(patientOpt.isSelected()).toBeTruthy();

        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.patient-opt'))).not.toBeNull();
      }
    }
  });

  it('Changing the date selection via handleDateToggle handler should reset the xAxisFormatter', () => {
    const date = new Date('Mon Apr 29 2019 21:33:16 GMT-0400');

    // On initialization, the date formatter should go to day
    component.reAssignXTickFormatter();
    let formatter = component.xAxisTickFormater;
    expect(formatter(date)).toBe('29/4/2019');

    // Toggling to year should change the formatter to only return the year
    component.handleDateToggle(DateOpt.YEAR);
    formatter = component.xAxisTickFormater;
    expect(formatter(date)).toBe('2019');

    component.handleDateToggle(DateOpt.DAY);
    formatter = component.xAxisTickFormater;
    expect(formatter(date)).toBe('29/4/2019');
  });

  it('Uploading multiple patient data should toggle the selected patient to the most recently uploaded', () => {
    // Toggle date selector to be the most granular so there is no name joining
    component.handleDateToggle(DateOpt.MIN_SEC);

    for (const evt of INIT_DATA_POINTS_EVENTS) {
      component.addVcfUpload(evt);

      let numPatientsSelected = 0;
      component.patientToggles.forEach((opt: Toggle) => {
        if (opt.isSelected()) {
          numPatientsSelected += 1;
        }
      });
      expect(numPatientsSelected).toBe(1);
      expect(component.patientToggles.get(evt['name']).isSelected()).toBeTruthy();
    }

    verifyResults(component.results);
  });

  it('Correct data transformation on upload of vcf', () => {
    // Toggle date selector to be the most granular so there is no name joining
    component.handleDateToggle(DateOpt.MIN_SEC);
    for (const evt of INIT_DATA_POINTS_EVENTS) {
      component.addVcfUpload(evt);
    }
    expect(component.hpvPatientData).toEqual(INIT_DATA_POINTS);
    verifyResults(component.results);
  });

  it('Data upload of vcf should update to the vcf map', () => {
    // Toggle date selector to be the most granular so there is no name joining
    component.handleDateToggle(DateOpt.MIN_SEC);

    for (const evt of INIT_DATA_POINTS_EVENTS) {
      // Upload event, then simulate clicking on the variantInfo entry visualized in the map
      component.addVcfUpload(evt);
      for (const vi of evt['variantInfo']) {
        const chr = vi['CHROM'];
        const date = evt['date'];
        const name = evt['name'];

        const $event: Object = {
          series: name,
          name: date,
          value: chr
        };

        const data: Object[] = component.onClick($event);
        expect(data.length > 0).toBeTruthy();
        expect(data[0]['CHROM']).toBe(chr);
      }
    }

    verifyResults(component.results);
  });

  it('Date toggle should modify the vcf map and return data successfully', () => {
    // Toggle date selector to be the most granular so there is no name joining
    component.handleDateToggle(DateOpt.MIN_SEC);
    for (const evt of INIT_DATA_POINTS_EVENTS) {
      component.addVcfUpload(evt);
    }
    verifyResults(component.results);

    const selectedSubject = 'P1';
    const selectedDateOpt: DateOpt = DateOpt.YEAR;

    /**
     * The chromosomes in this set should be aggregated by toggling the date, i.e. After date-toggle, the component's
     * "results" array should have two entries from multiple date entries of the original INIT_DATA_POINTS_EVENTS
     */
    const aggregatedChromosomes: Set<string> = new Set(['C3', 'C4']);

    // Here we check that the 'selectedSubject' of the input events has multiple date entries
    expect(aggregatedChromosomes.size > 0).toBeTruthy();
    const chromosomes = INIT_DATA_POINTS_EVENTS
      .filter(evt => evt['name'] === selectedSubject) // filter out only selectedPatient
      .map(evt => evt['variantInfo'])                 // { variantInfo: { CHROM: 'C1' } } -> { CHROM: 'C1' }
      .map(vi => vi['variantInfo'].map(o => o['CHROM']))              // { CHROM: 'C1' }, { CHROM: 'C1' } -> [ 'C1', 'C2' ]
      .reduce((accumulator, curr) => accumulator.concat(curr)); // ['C1','C2'],['C3'] -> ['C1','C2','C3' ]
    aggregatedChromosomes.forEach((a) => {
      expect(chromosomes.filter((c) => a === c).length > 0).toBeTruthy();
    });

    // Choose a patient with multiple different date entries, e.g. 'P1'
    component.handlePatientToggle(name);

    // Aggregate all data points to one date
    component.handleDateToggle(selectedDateOpt);

    const patientDataPoints: Object[] = INIT_DATA_POINTS_EVENTS.filter(evt => evt['name'] === selectedSubject);
    for (const dp of patientDataPoints) {
      const series: string = dp['name'];
      const name: Date = component.formatDate(dp['date'], component.getTimeFields());
      const variantInfo: Object[] = dp['variantInfo'];

      for (const vi of variantInfo) {
        const value: string = vi['CHROM'];
        const evt: Object = {series, name, value};
        const vals: Object[] = component.onClick(evt);

        if (aggregatedChromosomes.has(value)) {
          // Check that the expected chromosomes are aggregated
          expect(vals.length > 1).toBeTruthy();
        } else {
          // If not aggregated, the length should still be 1
          expect(vals.length).toBe(1);
        }
      }
    }
    verifyResults(component.results);
  });

  it('Changing the patient selection should fitler results to only the toggled patient', () => {
    // Toggle date selector to be the most granular so there is no name joining
    component.handleDateToggle(DateOpt.MIN_SEC);

    // Choose an entry that has a unique 'name' field (e.g. not 'P1')
    const selectedDataPoint: Object = INIT_DATA_POINTS_EVENTS[1];
    component.addVcfUpload(selectedDataPoint);

    const name = selectedDataPoint['name'];
    component.handlePatientToggle(name);
    expect(component.patientToggles.get(name).isSelected()).toBeTruthy();
    expect(component.results.length).toBe(1);

    verifyResults(component.results);
  });

  /**
   * TOOD - Test where multiple patients are present and there's another upload. Only data points of the most recently
   * uploaded should be selected
   */

  it('includeInModal contains only upper-case strings', () => {
    component.includeInModal.forEach(function (header) {
      expect(header).toEqual(header.toUpperCase());
    });
  });

  it('Should have modal when onClick fires and it should be removed when closeModal', () => {
    component.handleDateToggle(DateOpt.MIN_SEC);

    for (const evt of INIT_DATA_POINTS_EVENTS) {
      component.addVcfUpload(evt);
      for (const vi of evt['variantInfo']) {
        const chr = vi['CHROM'];
        const date = evt['date'];
        const name = evt['name'];

        const $event: Object = {
          series: name,
          name: date,
          value: chr
        };

        component.onClick($event);
        fixture.detectChanges();

        const modalContainer = fixture.debugElement.nativeElement.querySelector('.modal-container');
        expect(modalContainer).not.toBeNull();

        expect(window.getComputedStyle(modalContainer).display).toBe('block');
        expect(component.selectedVariant.length > 0).toBeTruthy();
        expect(component.headers.length > 0).toBeTruthy();
        expect(component.modalTitle).not.toEqual('');

        // Fire closeModal
        component.closeModal(true);
        fixture.detectChanges();

        expect(window.getComputedStyle(modalContainer).display).toBe('none');
        expect(component.selectedVariant.length === 0).toBeTruthy();
        expect(component.headers.length === 0).toBeTruthy();
        expect(component.modalTitle).toEqual('');
      }
    }
  });

  it('Should set modal information when onClick is called', () => {
    component.handleDateToggle(DateOpt.MIN_SEC);

    for (const evt of INIT_DATA_POINTS_EVENTS) {
      component.addVcfUpload(evt);
      for (const vi of evt['variantInfo']) {
        const chr = vi['CHROM'];
        const date = evt['date'];
        const name = evt['name'];

        const $event: Object = {
          series: name,
          name: date,
          value: chr
        };

        component.onClick($event);
        expect(component.selectedVariant.length > 0).toBeTruthy();
        expect(component.headers).toEqual(['CHROM']);
        expect(component.modalTitle.includes(chr)).toBeTruthy();
      }
    }
  });
});
