import {  async,
          ComponentFixture,
          TestBed }               from '@angular/core/testing';
import {  DateOpt }               from './graph-options.enums';
import {  TypeGraphComponent }    from './type-graph.component';
import {  NO_ERRORS_SCHEMA,
          DebugElement }          from '@angular/core';
import {  INIT_DATA_POINTS,
          INIT_DATA_POINTS_EVENTS,
          YEAR_TRANSFORM_DATES }  from '../../test/mock-data/mock-viz';
import {  TEST_FILES }            from '../../test/mock-data/vcf-files';
import { PatientOption }          from './patient-option.class';
import { By }                     from '@angular/platform-browser';

describe('TypeGraphComponent', () => {
  let component: TypeGraphComponent;
  let fixture: ComponentFixture<TypeGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeGraphComponent ],
      schemas:      [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeGraphComponent);
    component = fixture.componentInstance;

    // For these tests, we'll enable all dateOptions
    for( const key in component.datesOptionsEnabled ) {
      if(component.datesOptionsEnabled.hasOwnProperty(key)){
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
    const testDate = new Date('Sat Apr 06 2019 14:00:04 GMT-0400');
    const testCases = [
      [ DateOpt.MIN_SEC, new Date('Sat Apr 06 2019 14:00:04 GMT-0400') ],
      [ DateOpt.HOUR,    new Date('Sat Apr 06 2019 14:00:00 GMT-0400') ],
      [ DateOpt.DAY,     new Date('Sat Apr 06 2019 00:00:00 GMT-0400') ],
      [ DateOpt.MONTH,   new Date('Mon Apr 01 2019 00:00:00 GMT-0400') ],
      [ DateOpt.YEAR,    new Date('Tue Jan 01 2019 00:00:00 GMT-0500') ]
    ];


    for ( const test of testCases ) {
      const timeSelect = test[ 0 ];
      const expectedDate = <Date>test[ 1 ];

      component.handleDateToggle(<DateOpt>timeSelect);
      const timeFields: DateOpt[] = component.getTimeFields();
      const actualDate = <Date>component.formatDate(testDate, timeFields );

      expect( actualDate.getTime() ).toBe( expectedDate.getTime() );
    }
  });

  it( 'SelectedTimeOption should be DAY upon initialization', () => {
    expect( component.getSelectedTimeOption() ).toBe( DateOpt.DAY );
  });

  it( 'Date selection fields (dataSelectors/timeSelect) change on toggle (handleDateToggle)', () => {
    // Mock data w/ patient map
    // TODO - Put this into a private method
    for ( const fileName in TEST_FILES ) {
      if (TEST_FILES.hasOwnProperty(fileName)) {
        const event = TEST_FILES[ fileName ]['event'];
        component.addVcfUpload(event);
      }
    }

    // NOTE - TimeSelect should be initialized to DAY
    let oldToggle: DateOpt = DateOpt.DAY;
    let newToggle: DateOpt = DateOpt.YEAR;

    // Shouldn't do anything
    expect( component.dateSelectors[ oldToggle ][ 'selected' ] ).toBeTruthy();
    expect( component.dateSelectors[ newToggle ][ 'selected' ] ).toBeFalsy();
    component.handleDateToggle( DateOpt.DAY );
    expect( component.getSelectedTimeOption() ).toBe( oldToggle );
    expect( component.dateSelectors[ oldToggle ][ 'selected' ] ).toBeTruthy();
    expect( component.dateSelectors[ newToggle ][ 'selected' ] ).toBeFalsy();

    const values: DateOpt[] = Object.values(DateOpt);
    for ( const v of values ) {
      newToggle = v;
      expect( component.dateSelectors[ oldToggle ][ 'selected' ] ).toBeTruthy();
      expect( component.dateSelectors[ newToggle ][ 'selected' ] ).toBeFalsy();

      component.handleDateToggle( newToggle );

      expect( component.getSelectedTimeOption() ).toBe( newToggle );
      expect( component.dateSelectors[ oldToggle ][ 'selected' ] ).toBeFalsy();
      expect( component.dateSelectors[ newToggle ][ 'selected' ] ).toBeTruthy();
      oldToggle = newToggle;
    }
  });

  it( 'Toggling the date option should transforms hpvPatientData', () => {
    // TODO - Put this into a private method
    for ( const fileName in TEST_FILES ) {
      if (TEST_FILES.hasOwnProperty(fileName)) {
        const event = TEST_FILES[ fileName ]['event'];
        component.addVcfUpload(event);
      }
    }

    // NOTE - TimeSelect should be initialized to DAY
    component.handleDateToggle( DateOpt.YEAR );

    // Makes sure all data-points get tested
    let numDataPoints = component.hpvPatientData.length;

    for ( const entry of component.hpvPatientData ) {
      numDataPoints -= 1;

      const name    = entry[ 'name' ];
      const series  = entry[ 'series' ];
      const date    = YEAR_TRANSFORM_DATES[ name ];

      for ( const dp of series ) {
        expect( dp[ 'x' ].getTime() ).toBe( date.getTime() );
      }
    }

    expect( numDataPoints ).toBe( 0 );
  });

  // TODO - Maybe make this more finer-grained once a design is approved
  it( 'x-axis variables are changed with a min and max value outside the range of xAxisTicks', () => {
    let xScaleMin, xScaleMax, xAxisTicks;
    // TODO - Put this into a private method
    for ( const fileName in TEST_FILES ) {
      if (TEST_FILES.hasOwnProperty(fileName)) {
        const event = TEST_FILES[ fileName ]['event'];
        component.addVcfUpload(event);
      }
    }
    const values: DateOpt[] = Object.values(DateOpt);
    for ( const v of values ) {
      component.handleDateToggle( v );
      xScaleMin   = component.xScaleMin;
      xScaleMax   = component.xScaleMax;
      xAxisTicks  = component.xAxisTicks;

      expect( xScaleMin ).not.toBeNull();
      expect( xScaleMax ).not.toBeNull();
      expect( xAxisTicks.length ).not.toBe(0);

      const xView = xAxisTicks;
      xView.push( xScaleMax );
      xView.unshift( xScaleMin );

      // Check that there's a min, max, and values in view
      expect( xView.length > 2 );

      // Verify ascending order (implicitly checks there's a buffer on each side of the datapoints
      for ( let i = 0; i < xView.length - 1; i++ ) {
        expect( xView[i] < xView[i + 1] ).toBeTruthy();
      }
    }
  });

  it( 'When addVcfUpload handler receives an event, it correctly parses it into a datapoint', () => {
    for ( const fileName in TEST_FILES ) {
      if (TEST_FILES.hasOwnProperty(fileName)) {
        const event = TEST_FILES[ fileName ]['event'];
        component.addVcfUpload(event);

        const patientData = component.hpvPatientData;

        const expected = TEST_FILES[ fileName ]['datapoint'];
        const actual = patientData[patientData.length - 1];

        expect( actual['name'] ).toBe( expected['name'] );
        expect( actual['date'].toDateString() ).toBe( expected['date'].toDateString() );
        // NOTE - To test the series, comparing by date string isn't going to give the expected equality
        expect( actual['series'] ).not.toBeNull();
      }
    }
  });

  it( 'When addVcfUpload handler receives an event, it should populate the patient options map and render a patient '
      + 'option and render an option in the view', () => {
    // Verify initial state
    expect( fixture.debugElement.query(By.css('.patient-opt')) ).toBeNull();
    expect( component.patientMap.size ).toBe( 0 );

    for ( const fileName in TEST_FILES ) {
      if (TEST_FILES.hasOwnProperty(fileName)) {
        const event = TEST_FILES[ fileName ]['event'];
        const name = event['name'];

        component.addVcfUpload(event);

        // Patient Map is updated w/ a patient option
        const patientOpt: PatientOption = component.patientMap.get(name);
        expect( patientOpt.getName() ).toBe( name );
        expect( patientOpt.isSelected() ).toBeTruthy();

        fixture.detectChanges();
        expect( fixture.debugElement.query(By.css('.patient-opt')) ).not.toBeNull();
      }
    }
  });

  it( 'Changing the date selection via handleDateToggle handler should reset the xAxisFormatter', () => {
    const date = new Date('Mon Apr 29 2019 21:33:16 GMT-0400');

    // On initialization, the date formatter should go to day
    component.reAssignXTickFormatter();
    let formatter = component.xAxisTickFormater;
    expect( formatter(date) ).toBe( '29/4/2019' );

    // Toggling to year should change the formatter to only return the year
    component.handleDateToggle(DateOpt.YEAR);
    formatter = component.xAxisTickFormater;
    expect( formatter(date) ).toBe( '2019' );

    component.handleDateToggle(DateOpt.DAY);
    formatter = component.xAxisTickFormater;
    expect( formatter(date) ).toBe( '29/4/2019' );
  });

  it( 'Uploading multiple patient data should toggle the selected patient to the most recently uploaded', () => {
    // Toggle date selector to be the most granular so there is no name joining
    component.handleDateToggle(DateOpt.MIN_SEC);

    for ( const evt of INIT_DATA_POINTS_EVENTS ) {
      component.addVcfUpload(evt);

      let numPatientsSelected = 0;
      component.patientMap.forEach((opt: PatientOption) => {
        if( opt.isSelected() ) numPatientsSelected += 1;
      });
      expect( numPatientsSelected ).toBe( 1 );
      expect( component.patientMap.get(evt['name']).isSelected()).toBeTruthy();
    }
  });

  it( 'Changing the patient selection should fitler results to only the toggled patient', () => {
    // Toggle date selector to be the most granular so there is no name joining
    component.handleDateToggle(DateOpt.MIN_SEC);
    for ( const evt of INIT_DATA_POINTS_EVENTS ) component.addVcfUpload(evt);

    const name = INIT_DATA_POINTS_EVENTS[0]['name'];
    component.handlePatientToggle( name );
    expect( component.patientMap.get(name).isSelected() ).toBeTruthy();
    expect(component.results.length).toBe( 1);
  });

  // TOOD - Test where multiple patients are present and there's another upload. Only data points of the most recently uploaded should be selected
});
