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

  getPatientData(): Object[] {
    return this.hpvDataService.getHpvData();
  }

  constructor(private hpvDataService: HpvDataService) {
    this.hpvPatientData = this.getPatientData();
  }

  ngOnInit() {
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
