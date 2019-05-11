import { NgModule } from '@angular/core';
import { NgxChartsModule }       from '@swimlane/ngx-charts';

// COMPONENTS
import { HpvVizComponent } from './hpv-viz.component';
import { TypeGraphComponent } from './type-graph/type-graph.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { SelectBoxComponent } from './common/select-box/select-box.component';

// SERVICES
import { HpvDataService } from './services/hpv-data-service';

// DIRECTIVES
import { FileDropDirective } from './directives/file-drop.directive';

const CHILD_COMPONENTS = [ TypeGraphComponent, FileUploadComponent, SelectBoxComponent ];
const SERVICES = [ HpvDataService ];

@NgModule({
  imports: [
    NgxChartsModule
  ],
  declarations: [ HpvVizComponent, FileDropDirective, CHILD_COMPONENTS ],
  exports: [HpvVizComponent],
  providers: [ SERVICES ]
})
export class HpvVizModule { }
