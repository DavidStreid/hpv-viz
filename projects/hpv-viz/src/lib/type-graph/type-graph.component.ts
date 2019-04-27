import { Component, OnInit } from '@angular/core';
import { HpvDataService } from '../services/hpv-data-service';

@Component({
  selector:      'app-type-graph',
  templateUrl:  './type-graph.component.html',
  styleUrls:    ['./type-graph.component.css'],
  providers:    [ HpvDataService ]
})
export class TypeGraphComponent implements OnInit {
  public hpvPatientData: Object[];

  constructor(private hpvDataService: HpvDataService) {
    this.hpvPatientData = this.getPatientData();
  }
  ngOnInit() {}

  // TODO - Add mock data
  getPatientData(): Object[] {
    // Returns an empty array initially
    return [];
  }

  isValidDataPoint(dataPoint: any): boolean {
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

  /**
   * Handler for uplaod event, which should be formatted as a datapoint
   */
  addVcfUpload($event: Object): void {
    if( !this.isValidDataPoint( $event ) ){
      console.error( 'Invalid upload' );
      return;
    }

    const hpvPatientData = this.hpvPatientData.slice(0);
    hpvPatientData.push($event);
    this.hpvPatientData = hpvPatientData;
  }

  view: any[] = [750, 400];

  // options
  showXAxis = false;
  showYAxis = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = 'Hpv Location';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

}
