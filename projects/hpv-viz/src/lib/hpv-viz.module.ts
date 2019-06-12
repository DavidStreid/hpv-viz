import { NgModule }                from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule }         from '@swimlane/ngx-charts';

// LOCAL DEPENDENCIES - Remove when deployed
const LOCAL_MODULES = [ BrowserAnimationsModule ];
// const LOCAL_MODULES = [ ];

// COMPONENTS
import { HpvVizComponent } from './hpv-viz.component';
import { TypeGraphComponent } from './type-graph/type-graph.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { SelectBoxComponent } from './common/select-box/select-box.component';
import { TableModalComponent } from './common/modal/table-modal.component';

// SERVICES
import { HpvDataService } from './services/hpv-data-service';

// DIRECTIVES
import { FileDropDirective } from './directives/file-drop.directive';

const CHILD_COMPONENTS = [ TypeGraphComponent, FileUploadComponent, SelectBoxComponent, TableModalComponent ];
const SERVICES = [ HpvDataService ];

@NgModule({
  imports: [
    NgxChartsModule,
    LOCAL_MODULES
  ],
  declarations: [ HpvVizComponent, FileDropDirective, CHILD_COMPONENTS ],
  exports: [HpvVizComponent],
  providers: [ SERVICES ]
})
export class HpvVizModule { }
