import {  async,
          ComponentFixture,
          TestBed }               from '@angular/core/testing';
import {  DateOpt }               from './graph-options.enums';
import {  TypeGraphComponent }    from './type-graph.component';
import {  NO_ERRORS_SCHEMA }      from '@angular/core';
import {  INIT_DATA_POINTS,
          YEAR_TRANSFORM_DATES }  from '../../../../tests/mock-data/mock-viz';
import {  TEST_FILES } from '../../../../tests/mock-data/vcf-files';

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
    ]

    var currOpt = DateOpt.MIN_SEC;
    for( var test of testCases ){
      const timeSelect = test[ 0 ];
      const expectedDate = <Date>test[ 1 ];

      component.handleToggle(<DateOpt>timeSelect);
      const timeFields: DateOpt[] = component.getTimeFields();
      const actualDate = <Date>component.formatDate(testDate, timeFields );

      expect( actualDate.getTime() ).toBe( expectedDate.getTime() );
    }
  });

  it( 'SelectedTimeOption should be DAY upon initialization', () => {
    expect( component.getSelectedTimeOption() ).toBe( DateOpt.DAY );
  });

  it( 'Date selection fields (dataSelectors/timeSelect) change on toggle (handleToggle)', () => {
    // Mock Data
    component.hpvPatientData = INIT_DATA_POINTS;

    // NOTE - TimeSelect should be initialized to DAY
    var oldToggle: DateOpt = DateOpt.DAY;
    var newToggle: DateOpt = DateOpt.YEAR;

    // Shouldn't do anything
    expect( component.dataSelectors[ oldToggle ][ 'selected' ] ).toBeTruthy();
    expect( component.dataSelectors[ newToggle ][ 'selected' ] ).toBeFalsy();
    component.handleToggle( DateOpt.DAY );
    expect( component.getSelectedTimeOption() ).toBe( oldToggle );
    expect( component.dataSelectors[ oldToggle ][ 'selected' ] ).toBeTruthy();
    expect( component.dataSelectors[ newToggle ][ 'selected' ] ).toBeFalsy();

    const values: DateOpt[] = Object.values(DateOpt);
    for( var v of values ) {
      newToggle = v;
      expect( component.dataSelectors[ oldToggle ][ 'selected' ] ).toBeTruthy();
      expect( component.dataSelectors[ newToggle ][ 'selected' ] ).toBeFalsy();

      component.handleToggle( newToggle );

      expect( component.getSelectedTimeOption() ).toBe( newToggle );
      expect( component.dataSelectors[ oldToggle ][ 'selected' ] ).toBeFalsy();
      expect( component.dataSelectors[ newToggle ][ 'selected' ] ).toBeTruthy();
      oldToggle = newToggle;
    }
  });

  it( 'Toggling the date option should transforms hpvPatientData', () => {
    // Mock Data
    component.hpvPatientData = INIT_DATA_POINTS;

    // NOTE - TimeSelect should be initialized to DAY
    component.handleToggle( DateOpt.YEAR );

    // Makes sure all datapoints get tested
    var numDataPoints = INIT_DATA_POINTS.length;

    for( var entry of component.hpvPatientData ){
      numDataPoints -= 1;

      const name    = entry[ 'name' ];
      const series  = entry[ 'series' ];
      const date    = YEAR_TRANSFORM_DATES[ name ]

      for( var dp of series ){
        expect( dp[ 'x' ].getTime() ).toBe( date.getTime() );
      }
    }

    expect( numDataPoints ).toBe( 0 );
  });

  // TODO - Maybe make this more finer-grained once a design is approved
  it( 'x-axis variables are changed with a min and max value outside the range of xAxisTicks', () => {
    var xScaleMin, xScaleMax, xAxisTicks;
    component.hpvPatientData = INIT_DATA_POINTS;
    const values: DateOpt[] = Object.values(DateOpt);
    for( var v of values ) {
      component.handleToggle( v );
      xScaleMin   = component.xScaleMin;
      xScaleMax   = component.xScaleMax;
      xAxisTicks  = component.xAxisTicks;

      expect( xScaleMin ).not.toBeNull();
      expect( xScaleMax ).not.toBeNull();
      expect( xAxisTicks.length ).not.toBe(0);

      var xView = xAxisTicks;
      xView.push( xScaleMax );
      xView.unshift( xScaleMin );

      // Check that there's a min, max, and values in view
      expect( xView.length > 2 );

      // Verify ascending order (implicitly checks there's a buffer on each side of the datapoints
      for( var i = 0; i<xView.length-1; i++ ){
        expect( xView[i] < xView[i+1] ).toBeTruthy();
      }
    }
  });

  it( 'When addVcfUpload handler receives an event, it correctly parses it into a datapoint', () => {
    for( var fileName in TEST_FILES ) {
      const event = TEST_FILES[ fileName ]['event'];
      component.addVcfUpload(event);

      const patientData = component.hpvPatientData;

      const expected = TEST_FILES[ fileName ]['datapoint'];
      const actual = patientData[patientData.length-1];

      expect( actual['name'] ).toBe( expected['name'] );
      expect( actual['date'].toDateString() ).toBe( expected['date'].toDateString() );
      // NOTE - To test the series, comparing by date string isn't going to give the expected equality
      expect( actual['series'] ).not.toBeNull();
    }
  });

  it( 'Changing the date selection via handleToggle handler should reset the xAxisFormatter', () => {
    const date = new Date('Mon Apr 29 2019 21:33:16 GMT-0400');

    // On initialization, the date formatter should go to day
    var formatter = component.xAxisTickFormater;
    expect( formatter(date) ).toBe( '29/3/2019' );

    // Toggling to year should change the formatter to only return the year
    component.handleToggle(DateOpt.YEAR);
    formatter = component.xAxisTickFormater;
    expect( formatter(date) ).toBe( '2019' );

    component.handleToggle(DateOpt.DAY);
    formatter = component.xAxisTickFormater;
    expect( formatter(date) ).toBe( '29/3/2019' );
  });
});
