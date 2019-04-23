import { NgModule } from '@angular/core';
import { NgxChartsModule }       from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// COMPONENTS
import { HpvVizComponent } from './hpv-viz.component';
import { TypeGraphComponent } from './type-graph/type-graph.component';

// SERVICES
import { HpvDataService } from './services/hpv-data-service';

const CHILD_COMPONENTS = [ TypeGraphComponent ]

const SERVICES = [ HpvDataService ]

@NgModule({
  imports: [
    NgxChartsModule,
    BrowserAnimationsModule
  ],
  declarations: [ HpvVizComponent, CHILD_COMPONENTS ],
  exports: [HpvVizComponent]
})
export class HpvVizModule { }
