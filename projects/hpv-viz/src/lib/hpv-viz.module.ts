import { NgModule } from '@angular/core';
import { NgxChartsModule }       from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// COMPONENTS
import { HpvVizComponent } from './hpv-viz.component';
import { TypeGraphComponent } from './type-graph/type-graph.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

// SERVICES
import { HpvDataService } from './services/hpv-data-service';

// DIRECTIVES
import { FileDropDirective } from './directives/file-drop.directive';

const CHILD_COMPONENTS = [ TypeGraphComponent, FileUploadComponent ]

const SERVICES = [ HpvDataService ]

@NgModule({
  imports: [
    NgxChartsModule,
    BrowserAnimationsModule
  ],
  declarations: [ HpvVizComponent, FileDropDirective, CHILD_COMPONENTS ],
  exports: [HpvVizComponent]
})
export class HpvVizModule { }
